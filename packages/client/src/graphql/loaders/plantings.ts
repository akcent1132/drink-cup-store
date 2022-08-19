import { Planting } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isNumber, toString } from "lodash";
import seedrandom from "seedrandom";
import { z } from "zod";
import { surveyStackApiUrl } from "../../utils/env";

declare module externalData {
  export interface Planting {
    _id: string;
    cropType: null | string;
    drupal_internal__id: number;
    drupal_uid: string;
    events: Event[];
    flag: string[];
    params: Params;
    producer: Producer;
    title: string;
    values: ValueElement[];
  }

  export interface Event {
    drupal_id: string;
    type: null | string;
    date: string;
  }

  export interface Params {
    zone: null | string;
    hardiness_zone: null | string;
    climate_region: null;
    temperature: number | null;
    precipitation: number | null;
    texture: string;
    soil_group: null | string;
    soil_suborder: null | string;
    soil_order: null | string;
    clay_percentage: number | null;
    sand_percentage: number | null;
    soil_texture: number | null;
  }

  export interface Producer {
    id: string;
  }

  export interface ValueElement {
    name: string;
    modus_test_id?: string;
    value?: string[] | number | null | string;
  }
}

const fixEventType = (type: string): string => {
  type = type.toLowerCase();
  switch (type) {
    case "weed_control":
      return "weeding";
    default:
      return type;
  }
};

const convertExternalPlanting = (planting: externalData.Planting): Planting => {
  const minimalExpectedPlantingData = z.object({
    drupal_uid: z.string(),
    events: z.array(
      z.object({
        drupal_id: z.string({
          required_error: `Event in planting#${planting.drupal_uid} is missing "drupal_id"`,
          invalid_type_error: `Event in planting#${planting.drupal_uid} has invalid "drupal_id"`,
        }),
      })
    ),
    producer: z.object({ id: z.string() }),
  });
  minimalExpectedPlantingData.parse(planting);

  return {
    ...planting,
    __typename: "Planting",
    cropType: planting.cropType!,
    id: planting.drupal_uid,
    values: planting.values
      .filter((v): v is externalData.ValueElement & { value: number } =>
        isNumber(v.value)
      )
      .map((v) => {
        return {
          ...v,
          modusId: v.modus_test_id || null,
          __typename: "PlantingValue",
          plantingId: planting.drupal_uid,
        };
      }),
    params: {
      __typename: "PlantingParams",
      sandPercentage: planting.params.sand_percentage,
      clayPercentage: planting.params.clay_percentage,
      soilGroup: planting.params.soil_group,
      soilOrder: planting.params.soil_order,
      soilSuborder: planting.params.soil_suborder,
      soilTexture: planting.params.soil_texture,
    },
    producer: {
      ...planting.producer,
      __typename: "Producer",
      code: seedrandom(planting.producer.id)().toString(32).slice(-7),
      plantings: [],
    },
    events: planting.events.map((e) => ({
      ...e,
      id: e.drupal_id,
      type: fixEventType(e.type || ""),
      details: [],
      __typename: "PlantingEvent",
    })),
  };
};

const plantingMap = new Map<string, Planting>();
const addPlantingsToMap = (plantings: Planting[]) =>
  plantings.forEach((planting) => plantingMap.set(planting.id, planting));

export const loadPlantings = pMemoize(async () => {
  const externalPlantings: externalData.Planting[] = await fetch(
    surveyStackApiUrl(`static/coffeeshop/plantings`)
  ).then((result) => result.json());

  const clientPlantings: Planting[] = externalPlantings
    .filter((p) => p.cropType !== null)
    .map(convertExternalPlanting);
  addPlantingsToMap(clientPlantings);
  return clientPlantings;
});

export const loadPlantingsOfCrop = pMemoize(async (cropType) => {
  console.log("loadPlantingsOfCrop");
  const externalPlantings: externalData.Planting[] = await fetch(
    surveyStackApiUrl(`static/coffeeshop/species_plantings/${cropType}`)
  ).then((result) => result.json());
  console.log("externalPlantings", externalPlantings);
  const clientPlantings: Planting[] = externalPlantings
    .filter((p) => p.cropType !== null)
    .map(convertExternalPlanting);
  addPlantingsToMap(clientPlantings);
  return clientPlantings;
});

export const loadPlanting = pMemoize(
  async (plantingId: string): Promise<Planting | null> => {
    const planting = plantingMap.get(plantingId);
    if (planting) {
      return planting;
    }

    // Load planting if it wasn't in the cache map
    const externalPlanting: externalData.Planting = await fetch(
      surveyStackApiUrl(`static/coffeeshop/planting_details/${plantingId}`)
    ).then((result) => result.json());
    return convertExternalPlanting(externalPlanting);
  }
);

// const createFakePlantings = (
//   cropType: string,
//   count: number,
//   stdMax = 2,
//   meanMax = 5
// ): Planting[] => {
//   const rnd = seedrandom(cropType + "create planting data");
//   return range(count).map((i) => {
//     const id = (plantingId++).toString();
//     const values: PlantingValue[] = [];
//     const walk = (rows: RowData[]) => {
//       for (const row of rows) {
//         // use the same distribution on the same rows
//         const rndValue = seedrandom(cropType + row.name);
//         const mean = (rndValue() - 0.5) * meanMax;
//         const std = rndValue() * stdMax;
//         // TODO add multilpe measurements to some value types
//         // const count = countMax * rndValue();
//         const norm = randomNormal.source(rnd)(mean, std);
//         if (row.type === "value") {
//           values.push({
//             __typename: "PlantingValue",
//             name: row.name,
//             value: norm(),
//             plantingId: id,
//             modusId: "MOD-US/ID",
//           });
//         }
//         if (row.children) {
//           walk(row.children);
//         }
//       }
//     };
//     walk(ROWS);
//     const zone = randomZone();
//     let texture = [Math.random(), Math.random()];
//     texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
//     return {
//       __typename: "Planting",
//       isHighlighted: false,
//       id,
//       cropType,
//       values,
//       title: `${startCase(cropType)} ${2017 + Math.floor(Math.random() * 6)}`,
//       producer: sample(producers())!,
//       params: {
//         __typename: "PlantingParams",
//         zone: zone.name,
//         temperature: zone.temp.toString() + "°",
//         precipitation: `${32 + Math.floor(32 * Math.random())}″`,
//         texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
//       },
//       events: range(6 + 6 * Math.random()).map(() => getFarmEvent()),
//       matchingFilters: [],
//     };
//   });
// };
