import { Planting } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isNumber, toString } from "lodash";
import seedrandom from "seedrandom";

declare module externalData {
  export interface Planting {
    _id: string;
    cropType: null | string;
    drupal_internal__id: number;
    events: Event[];
    flag: string[];
    params: Params;
    producer: Producer;
    title: string;
    values: ValueElement[];
  }

  export interface Event {
    id: number;
    type: null | string;
    date: string;
  }

  export interface Params {
    texture: string;
    soil_group?: string;
    soil_suborder?: string;
    soil_order?: string;
    clay_percentage?: number;
    sand_percentage?: number;
    soil_texture?: number;
    zone?: string;
    hardiness_zone?: string;
    temperature?: number;
    precipitation?: number;
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

export const loadPlantings = pMemoize(async () => {
  const externalPlantings: externalData.Planting[] = await fetch(
    "https://app.surveystack.io/static/coffeeshop/plantings"
  ).then((result) => result.json());

  const clientPlantings: Planting[] = externalPlantings
    .filter((p) => p.cropType !== null)
    .map((planting) => {
      return {
        ...planting,
        __typename: "Planting",
        cropType: planting.cropType!,
        isHighlighted: false,
        id: planting._id,
        values: planting.values
          .filter((v): v is externalData.ValueElement & { value: number } =>
            isNumber(v.value)
          )
          .map((v) => {
            return {
              ...v,
              modusId: v.modus_test_id || null,
              __typename: "PlantingValue",
              plantingId: planting._id,
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
          id: e.id.toString(),
          type: fixEventType(e.type || ""),
          _planting_id_for_details_request:
            planting.drupal_internal__id.toString(),
          _producer_key_for_details_request: planting.producer.id.split(".")[0],
          details: [],
          __typename: "PlantingEvent",
        })),
        matchingFilters: [],
      };
    });
  return clientPlantings;
});

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
