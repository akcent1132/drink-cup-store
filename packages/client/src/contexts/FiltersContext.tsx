import { randomNormal } from "d3-random";
import {
  countBy,
  Dictionary,
  get,
  isEqual,
  isNumber,
  isString,
  keyBy,
  map,
  omitBy,
  range,
  sample,
  startCase,
  sum,
  toNumber,
  toString,
  uniq,
  uniqBy,
  uniqueId,
} from "lodash";
import React from "react";
import seedrandom from "seedrandom";
import { RowData, ROWS } from "./rows";
import { makeVar, ReactiveVar } from "@apollo/client";
import { CROPS } from "./lists";
import {
  Filter,
  FilterParam,
  FilterParamDataSource,
  FilterValue,
  Maybe,
  Planting,
  PlantingEventDetail,
  PlantingValue,
  Producer,
} from "../graphql.generated";
import { schemeTableau10 } from "d3-scale-chromatic";
import { getFarmEvent, randomZone } from "../utils/random";
import _ from "lodash";
window._ = _;

export const isDemo = () => !!process.env.STORYBOOK;

let plantingId = 0;
// const createPlantings = (
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

declare module externalData {
  export interface FarmProfile {
    farmDomain: string;
    title: string;
    surveystack_id: string;
    animals_detail: any;
    animals_total: number;
    area: any;
    area_community: any;
    area_total_hectares: number;
    average_annual_rainfall?: number;
    average_annual_temperature?: number;
    bio: any;
    certifications_current: string;
    certifications_current_detail: string[];
    certifications_future: any;
    certifications_future_detail: any[];
    climate_zone?: string;
    conditions_detail?: string;
    county?: string;
    equity_practices: any[];
    farm_leadership_experience: any;
    flexible: any;
    goal_1: any;
    goal_2: any;
    goal_3: any;
    hardiness_zone?: string;
    immediate_data_source: string;
    indigenous_territory: any[];
    interest: string[];
    land_other: any[];
    land_other_detail: any;
    land_type_detail: any;
    location_address_line1?: string;
    location_address_line2?: string;
    location_administrative_area: any;
    location_country_code?: string;
    location_locality?: string;
    location_postal_code?: string;
    management_plans_current: string;
    management_plans_current_detail: string[];
    management_plans_future: any;
    management_plans_future_detail: any[];
    motivations: string[];
    name: string;
    organization?: string;
    organization_id: any;
    preferred: any;
    products_animals: any[];
    products_categories: string[];
    products_detail: any[];
    products_value_added: any[];
    records_software: any[];
    records_system: string[];
    role?: string;
    schema_version: any;
    social: any;
    types: string[];
    unique_id: any;
    units?: string;
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

const cachedLoad = async <T,>(
  url: string,
  updateVars: (data: T) => void,
  lsKey: string
) => {
  // if (localStorage[lsKey]) {
  //   console.log("loading plantings from local storage...");
  //   try {
  //     updateVars(JSON.parse(localStorage[lsKey]));
  //   } catch (e) {
  //     console.error(
  //       `Failed to update data from localStorage["${lsKey}"]\n${e}`
  //     );
  //   }
  // }

  const data = await fetch(url).then((result) => result.json());
  try {
    updateVars(data);
    try {
      localStorage[lsKey] = JSON.stringify(data);
    } catch (e) {
      console.log(`Failed to cache data (${lsKey})`, e);
    }
  } catch (e) {
    console.error(`Failed to update vars from fresh data (${lsKey})\n${e}`);
  }
};

export const farmProfiles = makeVar<Dictionary<externalData.FarmProfile>>({});
export const getEventDetailsVar = (key: string) => {
  if (!eventDetailsMap[key]) {
    eventDetailsMap[key] = makeVar<PlantingEventDetail[] | null>(null);
  }
  return eventDetailsMap[key];
};
const _loadingEventDetails: { [key: string]: boolean } = {};
export const loadEventDetails = async (
  producerKey: string,
  plantingId: string
) => {
  const LS_KEY = `data.eventDetails.${producerKey}.${plantingId}`;
  if (_loadingEventDetails[LS_KEY]) {
    return;
  }
  _loadingEventDetails[LS_KEY] = true;

  const updateVars = (eventDetails: { [key: string]: string | string[] }[]) => {
    for (const details of eventDetails) {
      const { id, uuid, ...data } = details;
      const key = `${producerKey}/${plantingId}/${id}`;
      const list: PlantingEventDetail[] = map(data, (value, name) => ({
        id: `${uuid}/${key}/${name}`,
        valueList: Array.isArray(value) ? value : null,
        value: Array.isArray(value) ? null : value,
        name,
        __typename: "PlantingEventDetail" as "PlantingEventDetail",
      })).filter((d) => d.value || d.valueList);

      const eventDetailsVar = getEventDetailsVar(key);
      if (!isEqual(eventDetailsVar(), list)) {
        eventDetailsVar(list);
      }
    }
  };

  try {
    if (localStorage[LS_KEY]) {
      console.log("loading event details from local storage...");
      try {
        updateVars(JSON.parse(localStorage[LS_KEY]));
      } catch (e) {
        console.error(
          `Failed to update event details from localStorage["${LS_KEY}"]\n${e}`
        );
      }
    }

    console.log("load data...");

    const url = `https://app.surveystack.io/static/coffeeshop/events/${producerKey}/${plantingId}`;
    let externalData: { [key: string]: string | string[] }[] = await fetch(url)
      .then((result) => result.json())
      .catch((e) => {
        console.error(
          "Failed to load eventDetails from server. Reverting to fix data",
          e
        );
        return [];
      });

    console.log("Got data", externalData);
    try {
      updateVars(externalData);
      try {
        localStorage[LS_KEY] = JSON.stringify(externalData);
      } catch (e) {
        console.log("Failed to cache data", e);
      }
    } catch (e) {
      console.error(`Failed to update event details from fresh data\n${e}`);
    }

    console.log("finised loading data");
  } finally {
    _loadingEventDetails[LS_KEY] = false;
  }
};

// const createFilterParams = (): FilterParams => {
//   return {
//     __typename: "FilterParams",
//     types: sampleSize(TYPES, Math.random() * 3 + 1),
//     groups: sampleSize(GROUPS, Math.random() * 3 + 1),
//     colors: sampleSize(COLORS, Math.random() * 3 + 1),
//     flags: sampleSize(FLAGS, Math.random() * 3 + 1),
//     years: [2018, 2019, 2020],
//     sweetnessScore: range(10, 17).splice(
//       Math.random() * 8,
//       1 + Math.random() * 3
//     ),
//     flavorScore: range(1, 7).splice(Math.random() * 5, 1 + Math.random() * 3),
//     tasteScore: range(1, 9).splice(Math.random() * 8, 1 + Math.random() * 3),
//     climateRegion: sampleSize(CLIMATE_REGION, Math.random() * 3 + 1),
//     sampleSource: sampleSize(SAMPLE_SOURCE, Math.random() * 3 + 1),
//     farmPractices: sampleSize(FARM_PRACTICES, Math.random() * 3 + 1),
//     amendments: sampleSize(AMENDMENTS, Math.random() * 3 + 1),
//     landPreparation: sampleSize(LAND_PREPARATION, Math.random() * 3 + 1),
//     zones: sampleSize(ZONES, Math.random() * 3 + 1),
//   };
// };

const farmProfileFilterProperties = [
  { key: "farmDomain", type: "string" },
  { key: "title", type: "string" },
  // { key: "surveystack_id", type: "string" },
  // { key: "animals_detail", type: "n/a" },
  { key: "animals_total", type: "number" },
  // { key: "area", type: "n/a" },
  // { key: "area_community", type: "n/a" },
  { key: "area_total_hectares", type: "number" },
  { key: "average_annual_rainfall", type: "number" },
  { key: "average_annual_temperature", type: "number" },
  // { key: "bio", type: "n/a" },
  { key: "certifications_current", type: "string" },
  { key: "certifications_current_detail", type: "string" },
  // { key: "certifications_future", type: "n/a" },
  // { key: "certifications_future_detail", type: "n/a" },
  { key: "climate_zone", type: "string" },
  // { key: "conditions_detail", type: "string" },
  { key: "county", type: "string" },
  // { key: "equity_practices", type: "n/a" },
  // { key: "farm_leadership_experience", type: "n/a" },
  // { key: "flexible", type: "n/a" },
  // { key: "goal_1", type: "n/a" },
  // { key: "goal_2", type: "n/a" },
  // { key: "goal_3", type: "n/a" },
  { key: "hardiness_zone", type: "string" },
  { key: "immediate_data_source", type: "string" },
  // { key: "indigenous_territory", type: "n/a" },
  { key: "interest", type: "string" },
  // { key: "land_other", type: "n/a" },
  // { key: "land_other_detail", type: "n/a" },
  // { key: "land_type_detail", type: "n/a" },
  { key: "location_address_line1", type: "string" },
  { key: "location_address_line2", type: "string" },
  // { key: "location_administrative_area", type: "n/a" },
  { key: "location_country_code", type: "string" },
  { key: "location_locality", type: "string" },
  { key: "location_postal_code", type: "string" },
  { key: "management_plans_current", type: "string" },
  { key: "management_plans_current_detail", type: "string" },
  // { key: "management_plans_future", type: "n/a" },
  // { key: "management_plans_future_detail", type: "n/a" },
  { key: "motivations", type: "string" },
  // { key: "name", type: "string" },
  { key: "organization", type: "string" },
  // { key: "organization_id", type: "n/a" },
  // { key: "preferred", type: "n/a" },
  // { key: "products_animals", type: "n/a" },
  { key: "products_categories", type: "string" },
  // { key: "products_detail", type: "n/a" },
  // { key: "products_value_added", type: "n/a" },
  // { key: "records_software", type: "n/a" },
  { key: "records_system", type: "string" },
  { key: "role", type: "string" },
  // { key: "schema_version", type: "n/a" },
  // { key: "social", type: "n/a" },
  { key: "types", type: "string" },
  // { key: "unique_id", type: "n/a" },
  { key: "units", type: "string" },
];

let filterId = 0;
const createFilter = (
  color: string,
  name: string,
  cropType: string
): Filter => {
  const id = (++filterId).toString();
  // const p = [].filter((p) => p.cropType === cropType);
  // const values = p
  //   .map((p) => p.values)
  //   .flat()
  //   .reduce((acc, value) => {
  //     if (!(value.name in acc)) {
  //       acc[value.name] = {
  //         values: [],
  //         modusId: value.modusId,
  //       };
  //     }
  //     acc[value.name].values.push(value.value);
  //     return acc;
  //   }, {} as { [key: string]: { values: number[]; modusId: Maybe<string> } });

  // const valueParams: FilterParam[] = Object.keys(values).map((key) => ({
  //   __typename: "FilterParam" as "FilterParam",
  //   key,
  //   modusId: values[key].modusId,
  //   active: false,
  //   value: {
  //     __typename: "FilterValueRange" as "FilterValueRange",
  //     values: uniq(values[key].values).sort(),
  //     min: Math.min(...values[key].values),
  //     max: Math.max(...values[key].values),
  //   },
  //   dataSource: FilterParamDataSource.Values,
  // }));

  // const farmIdsInPlantings = uniq(plantings().map((p) => p.producer.id));
  // const relevantFarms = omitBy(
  //   farmProfiles(),
  //   (p) => !farmIdsInPlantings.includes(p.farmDomain)
  // );

  // const farmParams: FilterParam[] = farmProfileFilterProperties
  //   .map(({ key, type }) => {
  //     if (type === "number") {
  //       const values: number[] = uniq(
  //         Object.values(relevantFarms)
  //           .map((p) => get(p, key))
  //           .flat()
  //           .map(toNumber)
  //           .filter(isNumber)
  //       ).sort();
  //       return {
  //         key,
  //         value: {
  //           __typename: "FilterValueRange" as "FilterValueRange",
  //           values,
  //           min: Math.min(...values),
  //           max: Math.max(...values),
  //         },
  //       };
  //     }
  //     if (type === "string") {
  //       let allOptions: string[] = Object.values(relevantFarms)
  //         .map((p) => get(p, key))
  //         .flat()
  //         .map(toString)
  //         .filter((s) => isString(s) && s !== "");
  //       const occurenceMap = countBy(allOptions)
  //       allOptions = uniq(allOptions).sort()
  //       const occurences = allOptions.map(option => occurenceMap[option])
  //       return {
  //         key,
  //         value: {
  //           __typename: "FilterValueOption" as "FilterValueOption",
  //           allOptions,
  //           occurences,
  //           options: [],
  //         },
  //       };
  //     }
  //   })
  //   .filter(Boolean)
  //   .map((param) => {
  //     return {
  //       __typename: "FilterParam" as "FilterParam",
  //       active: false,
  //       modusId: null,
  //       dataSource: FilterParamDataSource.FarmOnboarding,
  //       ...param!,
  //     };
  //   });

  // // Remove empty filter params
  // const params = [...valueParams, ...farmParams].filter(
  //   (p) =>
  //     (p.value.__typename === "FilterValueOption" &&
  //       p.value.allOptions.length > 0) ||
  //     (p.value.__typename === "FilterValueRange" && p.value.values.length > 1)
  // );

  // console.log({ params });
  return {
    __typename: "Filter",
    id,
    name,
    cropType,
    color,
    plantings: [],
    params: [],
    isHighlighted: false,
  };
};

export const filters = makeVar<Filter[]>(
  isDemo()
    ? [
        createFilter(schemeTableau10[4], "Produce Corn, Beef", "corn"),
        createFilter(schemeTableau10[0], "General Mills - KS", "corn"),
      ]
    : []
);
export const producers = makeVar<Producer[]>(
  isDemo()
    ? range(128).map(() => ({
        __typename: "Producer",
        id: uniqueId(),
        code: Math.random().toString(32).slice(-7),
        plantings: [],
      }))
    : []
);
export const selectedFilterId = makeVar<string | null>(null);
export const selectedProducerId = makeVar<string | null>(null);
// TODO save in ls
export const selectedCropType = makeVar(isDemo() ? "corn" : "wheat");
export const eventDetailsMap: {
  [key: string]: ReactiveVar<PlantingEventDetail[] | null>;
} = {};

export const openEventCardIds = makeVar<string[]>([]);
export const openEventCard = (plantingId: string) => {
  if (!openEventCardIds().includes(plantingId)) {
    openEventCardIds([plantingId, ...openEventCardIds()]);
  }
  selectedFilterId(null);
  selectedProducerId(null);
};
export const closeEventCard = (plantingId: string) => {
  openEventCardIds(openEventCardIds().filter((id) => id !== plantingId));
};

export const highlightedPlantingId = makeVar<string | null>(null);
export const hightlightPlanting = (plantingId: string) => {
  highlightedPlantingId(plantingId);
};
export const unhightlightPlanting = (plantingId: string) => {
  if (plantingId === highlightedPlantingId()) highlightedPlantingId(null);
};

export const highlightedFilterId = makeVar<string | null>(null);
export const highlightFilter = (filterId: string) => {
  highlightedFilterId(filterId);
};
export const unhighlightFilter = (filterId: string) => {
  if (filterId === highlightedFilterId()) {
    highlightedFilterId(null);
  }
};

console.log("is demo:", isDemo());

export const addFilter = (color: string, name: string, cropType: string) => {
  const filter = createFilter(color, name, cropType);
  filters([...filters(), filter]);
  return filter;
};

// TODO combine right panel content type into one state
export const selectFilter = (filterId: string | null) => {
  selectedFilterId(filterId);
  selectedProducerId(null);
};

export const selectProducer = (producerId: string | null) => {
  selectedProducerId(producerId);
  selectedFilterId(null);
};

export const applyDraftFilter = (filterId: string) => {};
// filters(
//   filters().map((f) => {}
//     // f.id === filterId ? { ...f, activeParams: f.draftParams } : f
//   )
// );

export const updateFilterName = (filterId: string, name: string) =>
  filters(filters().map((f) => (f.id === filterId ? { ...f, name } : f)));

export const removeFilter = (filterId: string) => {
  filters(filters().filter((f) => f.id !== filterId));
  selectedFilterId(selectedFilterId() === filterId ? null : selectedFilterId());
};

export const removeAllFilters = () => {
  filters([]);
  selectedFilterId(null);
};

export const editFilterParam = (
  filterId: string,
  key: string,
  value: FilterValue
) =>
  filters(
    filters().map((f) =>
      f.id === filterId
        ? {
            ...f,
            params: f.params.map((p) => (p.key === key ? { ...p, value } : p)),
          }
        : f
    )
  );

export const setFilterParamActive = (
  filterId: string,
  key: string,
  active: boolean
) =>
  filters(
    filters().map((f) =>
      f.id === filterId
        ? {
            ...f,
            params: f.params.map((p) => (p.key === key ? { ...p, active } : p)),
          }
        : f
    )
  );

export const addFilterParam = (filterId: string, param: FilterParam) => {
  filters(
    filters().map((f) =>
      f.id === filterId
        ? {
            ...f,
            params: [...f.params.filter((p) => p.key !== param.key), param],
          }
        : f
    )
  );
};
export const removeFilterParam = (filterId: string, key: string) => {
  filters(
    filters().map((f) =>
      f.id === filterId
        ? {
            ...f,
            params: f.params.filter((p) => p.key !== key),
          }
        : f
    )
  );
};
