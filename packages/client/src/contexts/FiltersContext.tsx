import { randomNormal } from "d3-random";
import {
  range,
  sample,
  sampleSize,
  startCase,
  sum,
  uniqBy,
  uniqueId,
} from "lodash";
import React, { useContext, useReducer } from "react";
import seedrandom from "seedrandom";
import { RowData, ROWS } from "./rows";
import { makeVar } from "@apollo/client";
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
  PlantingValue,
  Producer,
} from "../graphql.generated";
import { schemeTableau10 } from "d3-scale-chromatic";
import { getFarmEvent, randomZone } from "../utils/random";

const isDemo = () => !!process.env.STORYBOOK;

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
  interface Value {
    name: string;
    value: any;
  }
  interface Event {
    id: number;
    type: string;
    date: string;
  }
  interface Producer {
    id: string;
  }
  interface Planting {
    _id: string;
    drupal_internal__id: number;
    values: Value[];
    title: string;
    events: Event[];
    cropType: string;
    producer: Producer;
  }
}

const loadPlantings = async () => {
  console.log("load data...");

  const externalPlantings: externalData.Planting[] = await (
    await fetch("https://app.surveystack.io/static/coffeeshop/plantings")
  ).json();
  console.log("Got data")
  const clientPlantings: Planting[] = externalPlantings.map((planting) => {
    const zone = randomZone();
    let texture = [Math.random(), Math.random()];
    texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
    return {
      ...planting,
      __typename: "Planting",
      isHighlighted: false,
      id: planting._id,
      values: planting.values.map((v) => ({
        ...v,
        __typename: "PlantingValue",
        plantingId: planting._id,
      })),
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
        code: Math.random().toString(32).slice(-7),
      },
      events: planting.events.map((e) => ({
        ...e,
        id: e.id.toString(),
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
  console.log("finised loading data")
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

export const filters = makeVar<Filter[]>([
  createFilter(schemeTableau10[4], "Produce Corn, Beef", "corn"),
  createFilter(schemeTableau10[0], "General Mills - KS", "corn"),
]);
export const producers = makeVar<Producer[]>(
  isDemo()
    ? []
    : range(128).map(() => ({
        __typename: "Producer",
        id: uniqueId(),
        code: Math.random().toString(32).slice(-7),
      }))
);
export const selectedFilterId = makeVar<string | null>(null);
export const selectedProducerId = makeVar<string | null>(null);
export const selectedCropType = makeVar(CROPS[5].name);

export const plantings = makeVar<Planting[]>(
  isDemo()
    ? []
    : CROPS.map((cropType) =>
        createPlantings(cropType.name, cropType.plantingCount)
      ).flat()
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

console.log("is demo:", isDemo())
if (!isDemo()) {
  loadPlantings();
}

// type Action =
//   | { type: "new"; color: string; name: string }
//   | { type: "select"; filterId: string | null }
//   | { type: "updateName"; filterId: string; name: string }
//   | {
//       type: "apply" | "delete";
//       filterId: string;
//     }
//   | {
//       type: "edit";
//       filterId: string;
//       params: Partial<FilterParams>;
//     }
//   | { type: "selectFarmer"; farmerId: string | null };

// const defaultState = Object.freeze({
//   filters: [] as Filter[],
//   selectedFilterId: null as string | null,
//   selectedFarmerId: null as string | null,
// });

// type State = typeof defaultState;

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

// const filtersReducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case "new": {
//       const filter = createFilter(action.color, action.name, "corn");
//       return {
//         ...state,
//         filters: [...state.filters, filter],
//         selectedFilterId: filter.id,
//       };
//     }
//     case "select": {
//       return {
//         ...state,
//         selectedFilterId: action.filterId,
//         selectedFarmerId: null,
//       };
//     }
//     case "selectFarmer": {
//       return {
//         ...state,
//         selectedFilterId: null,
//         selectedFarmerId: action.farmerId,
//       };
//     }
//     case "apply":
//       return {
//         ...state,
//         filters: state.filters.map((f) =>
//           f.id === action.filterId ? { ...f, activeParams: f.draftParams } : f
//         ),
//       };
//     case "updateName":
//       return {
//         ...state,
//         filters: state.filters.map((f) =>
//           f.id === action.filterId ? { ...f, name: action.name } : f
//         ),
//       };
//     case "delete":
//       return {
//         ...state,
//         selectedFilterId:
//           state.selectedFilterId === action.filterId
//             ? null
//             : state.selectedFilterId,
//         filters: state.filters.filter((f) => f.id !== action.filterId),
//       };
//     case "edit":
//       return {
//         ...state,
//         filters: state.filters.map((f) =>
//           f.id === action.filterId
//             ? {
//                 ...f,
//                 draftParams: {
//                   ...f.activeParams!,
//                   ...f.draftParams,
//                   ...action.params,
//                 },
//               }
//             : f
//         ),
//       };
//   }
// };

// const FiltersContext = React.createContext<[State, (action: Action) => void]>([
//   defaultState,
//   () => {},
// ]);

// export const FiltersProvider = ({ children }: React.PropsWithChildren<{}>) => {
//   const state = useReducer(filtersReducer, defaultState);
//   return (
//     <FiltersContext.Provider value={state}>{children}</FiltersContext.Provider>
//   );
// };

// export const useFiltersContext = () => useContext(FiltersContext);
