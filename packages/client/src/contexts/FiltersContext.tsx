import { randomNormal } from "d3-random";
import {
  isEqual,
  isNumber,
  map,
  range,
  sample,
  sampleSize,
  startCase,
  sum,
  take,
  uniqBy,
  uniqueId,
} from "lodash";
import React from "react";
import seedrandom from "seedrandom";
import { RowData, ROWS } from "./rows";
import { makeVar, ReactiveVar } from "@apollo/client";
import {
  CROPS,
  GROUPS,
  COLORS,
  CLIMATE_REGION,
  SAMPLE_SOURCE,
  FARM_PRACTICES,
  AMENDMENTS,
  LAND_PREPARATION,
} from "./lists";
import {
  Filter,
  FilterParams,
  Planting,
  PlantingEventDetail,
  PlantingValue,
  Producer,
} from "../graphql.generated";
import { schemeTableau10 } from "d3-scale-chromatic";
import { getFarmEvent, randomZone } from "../utils/random";

export const isDemo = () => !!process.env.STORYBOOK;

let plantingId = 0;
const createPlantings = (
  cropType: string,
  count: number,
  stdMax = 2,
  meanMax = 5
): Planting[] => {
  const rnd = seedrandom(cropType + "create planting data");
  return range(count).map((i) => {
    const id = (plantingId++).toString();
    const values: PlantingValue[] = [];
    const walk = (rows: RowData[]) => {
      for (const row of rows) {
        // use the same distribution on the same rows
        const rndValue = seedrandom(cropType + row.name);
        const mean = (rndValue() - 0.5) * meanMax;
        const std = rndValue() * stdMax;
        // TODO add multilpe measurements to some value types
        // const count = countMax * rndValue();
        const norm = randomNormal.source(rnd)(mean, std);
        if (row.type === "value") {
          values.push({
            __typename: "PlantingValue",
            name: row.name,
            value: norm(),
            plantingId: id,
          });
        }
        if (row.children) {
          walk(row.children);
        }
      }
    };
    walk(ROWS);
    const zone = randomZone();
    let texture = [Math.random(), Math.random()];
    texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
    return {
      __typename: "Planting",
      isHighlighted: false,
      id,
      cropType,
      values,
      title: `${startCase(cropType)} ${2017 + Math.floor(Math.random() * 6)}`,
      producer: sample(producers())!,
      params: {
        __typename: "PlantingParams",
        zone: zone.name,
        temperature: zone.temp.toString() + "°",
        precipitation: `${32 + Math.floor(32 * Math.random())}″`,
        texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
      },
      events: range(6 + 6 * Math.random()).map(() => getFarmEvent()),
      matchingFilters: [],
    };
  });
};

declare module externalData {
  export interface Planting {
    _id: string
    drupal_internal__id: number
    flag: string[]
    values: Value[]
    params: Params
    title: string
    events: Event[]
    cropType: string
    producer: Producer
  }
  
  export interface Value {
    name: string
    modus_test_id?: string
    value: any
  }
  
  export interface Params {
    texture: string
    zone?: string
    hardiness_zone?: string
    temperature?: number
    precipitation?: number
  }
  
  export interface Event {
    id: number
    type?: string
    date: string
  }
  
  export interface Producer {
    id: string
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

const loadPlantings = async () => {
  const LS_KEY = "data.plantings";

  const updateVars = (externalPlantings: externalData.Planting[]) => {
    const clientPlantings: Planting[] = externalPlantings
      .filter((p) => p.cropType !== null)
      .map((planting) => {
        const zone = randomZone();
        let texture = [Math.random(), Math.random()];
        texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
        return {
          ...planting,
          __typename: "Planting",
          isHighlighted: false,
          id: planting._id,
          values: planting.values.filter(v => isNumber(v.value)).map((v) => {
            return {
              ...v,
              __typename: "PlantingValue",
              plantingId: planting._id,
            }
          }),
          params: {
            __typename: "PlantingParams",
            zone: zone.name,
            temperature: zone.temp.toString() + "°",
            precipitation: `${32 + Math.floor(32 * Math.random())}″`,
            texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
          },
          producer: {
            ...planting.producer,
            __typename: "Producer",
            code: seedrandom(planting.producer.id)().toString(32).slice(-7),
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
    plantings(clientPlantings);
    producers(
      uniqBy(
        clientPlantings.map((p) => p.producer),
        "id"
      )
    );
  };

  if (localStorage[LS_KEY]) {
    console.log("loading plantings from local storage...");
    try {
      updateVars(JSON.parse(localStorage[LS_KEY]));
    } catch (e) {
      console.error(
        `Failed to update plantings from localStorage["${LS_KEY}"]\n${e}`
      );
    }
  }

  console.log("load data...");

  let externalPlantings: externalData.Planting[] = await fetch(
    "https://app.surveystack.io/static/coffeeshop/plantings"
  )
    .then((result) => result.json())
    .then((plantings) => {
      if (!Array.isArray(plantings) || plantings.length === 0) {
        throw new Error(
          `Got invalid planting data: '${JSON.stringify(plantings)}'`
        );
      }
      return take(plantings, 5800);
    })
    .catch((e) => {
      console.error(
        "Failed to load data from server. Reverting to fix data",
        e
      );
      console.warn("Loading fixed plantings...");
      return fetch("all-plantings-simplified.json").then((r) => r.json());
    });

  externalPlantings = externalPlantings.filter((p) => !!p.cropType);
  console.log("Got data");
  try {
    updateVars(externalPlantings);
    try {
      localStorage[LS_KEY] = JSON.stringify(externalPlantings);
    } catch (e) {
      console.log("Failed to cache data", e);
    }
  } catch (e) {
    console.error(`Failed to update plantings from fresh data\n${e}`);
  }

  console.log("finised loading data");
};

export const getEventDetailsVar = (key: string) => {
  if (!eventDetailsMap[key]) {
    eventDetailsMap[key] = makeVar<PlantingEventDetail[] | null>(null );
  }
  return eventDetailsMap[key];
}
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

      const eventDetailsVar = getEventDetailsVar(key)
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

const createFilterParams = (): FilterParams => {
  return {
    __typename: "FilterParams",
    groups: sampleSize(GROUPS, Math.random() * 3 + 1),
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
    years: [2018, 2019, 2020],
    sweetnessScore: range(1, 11).splice(
      Math.random() * 8,
      1 + Math.random() * 3
    ),
    flavorScore: range(1, 11).splice(Math.random() * 8, 1 + Math.random() * 3),
    tasteScore: range(1, 11).splice(Math.random() * 8, 1 + Math.random() * 3),
    climateRegion: sampleSize(CLIMATE_REGION, Math.random() * 3 + 1),
    sampleSource: sampleSize(SAMPLE_SOURCE, Math.random() * 3 + 1),
    farmPractices: sampleSize(FARM_PRACTICES, Math.random() * 3 + 1),
    amendments: sampleSize(AMENDMENTS, Math.random() * 3 + 1),
    landPreparation: sampleSize(LAND_PREPARATION, Math.random() * 3 + 1),
  };
};

let filterId = 0;
const createFilter = (
  color: string,
  name: string,
  cropType: string
): Filter => {
  const id = (++filterId).toString();
  const params = createFilterParams();
  return {
    __typename: "Filter",
    id,
    name,
    cropType,
    color,
    plantings: [],
    draftParams: params,
    activeParams: params,
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
      }))
    : []
);
export const selectedFilterId = makeVar<string | null>(null);
export const selectedProducerId = makeVar<string | null>(null);
export const selectedCropType = makeVar(isDemo() ? "corn" : "wheat");
export const eventDetailsMap: {
  [key: string]: ReactiveVar<PlantingEventDetail[] | null>;
} = {};

export const plantings = makeVar<Planting[]>(
  isDemo()
    ? CROPS.map((cropType) =>
        createPlantings(cropType.name, cropType.plantingCount)
      ).flat()
    : []
);
export const openEventCardIds = makeVar<string[]>(
  plantings()
    .filter((p) => p.cropType === selectedCropType())
    .map((p) => p.id)
    .slice(0, 2)
);
export const openEventCard = (plantingId: string) => {
  if (!openEventCardIds().includes(plantingId)) {
    openEventCardIds([plantingId, ...openEventCardIds()]);
  }
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
if (!isDemo()) {
  loadPlantings();
}

export const addFilter = (color: string, name: string, cropType: string) => {
  const filter = createFilter(color, name, cropType);
  filters([...filters(), filter]);
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

export const applyDraftFilter = (filterId: string) =>
  filters(
    filters().map((f) =>
      f.id === filterId ? { ...f, activeParams: f.draftParams } : f
    )
  );

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

export const editFilter = (filterId: string, params: Partial<FilterParams>) =>
  filters(
    filters().map((f) =>
      f.id === filterId
        ? {
            ...f,
            draftParams: {
              ...f.activeParams!,
              ...f.draftParams,
              ...params,
            },
          }
        : f
    )
  );
