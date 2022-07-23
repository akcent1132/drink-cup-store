import { Planting } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isNumber, sum } from "lodash";
import seedrandom from "seedrandom";

declare module externalData {
  export interface Planting {
    _id: string;
    drupal_internal__id: number;
    flag: string[];
    values: Value[];
    params: Params;
    title: string;
    events: Event[];
    cropType: string;
    producer: Producer;
  }

  export interface Value {
    name: string;
    modus_test_id?: string;
    value: any;
  }

  export interface Params {
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

  export interface Event {
    id: number;
    type?: string;
    date: string;
  }

  export interface Producer {
    id: string;
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
  console.log("!!!!!!!!!!!!Loads plantings")
  const externalPlantings: externalData.Planting[] = await fetch(
    "https://app.surveystack.io/static/coffeeshop/plantings"
  ).then((result) => result.json());

  const clientPlantings: Planting[] = externalPlantings
    .filter((p) => p.cropType !== null)
    .map((planting) => {
      let texture = [Math.random(), Math.random()];
      texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
      return {
        ...planting,
        __typename: "Planting",
        isHighlighted: false,
        id: planting._id,
        values: planting.values
          .filter((v) => isNumber(v.value))
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
          zone: "??",
          temperature: "?°",
          precipitation: `${32 + Math.floor(32 * Math.random())}″`,
          texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
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
          detailsKey: `${planting.producer.id.split(".")[0]}/${
            planting.drupal_internal__id
          }/${e.id.toString()}`,
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
