import { randomNormal } from "d3-random";
import { range, sample, sampleSize, startCase, sum } from "lodash";
import React, { useContext, useReducer } from "react";
import seedrandom from "seedrandom";
import { PlantingData } from "../stories/NestedRows";
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
import { Planting, PlantingValue } from "../graphql.generated";
import { schemeTableau10 } from "d3-scale-chromatic";
import { getFarmEvent, randomZone } from "../utils/random";

let plantingId = 0;
const createPlantings = (
  cropType: string,
  count: number,
  stdMax = 2,
  meanMax = 5
): Planting[] => {
  const rnd = seedrandom(cropType + "create planting data");
  return range(32 + 64 * rnd()).map((i) => {
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
          values.push({ name: row.name, value: norm() });
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
      id,
      cropType,
      values,
      title: `${startCase(cropType)} ${2017 + Math.floor(Math.random() * 6)}`,
      producerName: Math.random().toString(32).slice(-7),
      params: {
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

let plantingDataId = 0;
export const createFilteringData = (
  seed: string,
  countMax = 12,
  stdMax = 2,
  meanMax = 5
): PlantingData[][] => {
  const rnd = seedrandom(seed);
  return range(rnd() * countMax).map(() => {
    const values: { name: string; value: number; id: string }[] = [];
    const id = (plantingDataId++).toString();
    const walk = (rows: RowData[]) => {
      for (const row of rows) {
        const rndValue = seedrandom(seed + row.name);
        // TODO add multilpe measurements to some value types
        // const count = countMax * rndValue();
        const mean = (rndValue() - 0.5) * meanMax;
        const std = rndValue() * stdMax;
        const norm = randomNormal.source(rnd)(mean, std);
        if (row.type === "value") {
          values.push({ name: row.name, value: norm(), id });
        }
        if (row.children) {
          walk(row.children);
        }
      }
    };
    walk(ROWS);
    return values;
  });
};

const createFilterParams = () => {
  return {
    cropType: sample(CROPS),
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
const createFilter = (color: string, name: string, cropType?: string) => {
  const id = (++filterId).toString();
  return {
    id,
    name,
    cropType,
    groups: sampleSize(GROUPS, Math.random() * 3 + 1),
    color,
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
    plantings: [],
    draftParams: createFilterParams() as FilterParams | null,
    activeParams: null as FilterParams | null,
  };
};

export type FilterParams = ReturnType<typeof createFilterParams>;
export type Filter = ReturnType<typeof createFilter>;

export const filters = makeVar<ReturnType<typeof createFilter>[]>([
  createFilter("Produce Corn, Beef", schemeTableau10[4], "corn"),
  createFilter("General Mills - KS", schemeTableau10[0], "corn"),
]);
export const selectedFilter = makeVar<string | null>(null);
export const selectedProducer = makeVar<string | null>(null);
export const selectedCropType = makeVar(CROPS[5].name);
export const plantings = makeVar<Planting[]>(
  CROPS.map((cropType) =>
    createPlantings(cropType.name, cropType.plantingCount)
  ).flat()
);
export const openEventCards = makeVar<Planting[]>(
  plantings()
    .filter((p) => p.cropType === selectedCropType())
    .slice(0, 2)
);

type Action =
  | { type: "new"; color: string; name: string }
  | { type: "select"; filterId: string | null }
  | { type: "updateName"; filterId: string; name: string }
  | {
      type: "apply" | "delete";
      filterId: string;
    }
  | {
      type: "edit";
      filterId: string;
      params: Partial<FilterParams>;
    }
  | { type: "selectFarmer"; farmerId: string | null };

const defaultState = Object.freeze({
  filters: [] as Filter[],
  selectedFilterId: null as string | null,
  selectedFarmerId: null as string | null,
});

type State = typeof defaultState;

export const addFilter = (color: string, name: string, cropType: string) => {
  const filter = createFilter(color, name, cropType);
  filters([...filters(), filter]);
};

export const selectFilter = (filterId: string | null) =>
  selectedFilter(filterId);

export const selectProducer = (producerId: string | null) =>
  selectedProducer(producerId);

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
  selectedFilter(selectedFilter() === filterId ? null : selectedFilter());
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

const filtersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new": {
      const filter = createFilter(action.color, action.name, "corn");
      return {
        ...state,
        filters: [...state.filters, filter],
        selectedFilterId: filter.id,
      };
    }
    case "select": {
      return {
        ...state,
        selectedFilterId: action.filterId,
        selectedFarmerId: null,
      };
    }
    case "selectFarmer": {
      return {
        ...state,
        selectedFilterId: null,
        selectedFarmerId: action.farmerId,
      };
    }
    case "apply":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.filterId ? { ...f, activeParams: f.draftParams } : f
        ),
      };
    case "updateName":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.filterId ? { ...f, name: action.name } : f
        ),
      };
    case "delete":
      return {
        ...state,
        selectedFilterId:
          state.selectedFilterId === action.filterId
            ? null
            : state.selectedFilterId,
        filters: state.filters.filter((f) => f.id !== action.filterId),
      };
    case "edit":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.filterId
            ? {
                ...f,
                draftParams: {
                  ...f.activeParams!,
                  ...f.draftParams,
                  ...action.params,
                },
              }
            : f
        ),
      };
  }
};

const FiltersContext = React.createContext<[State, (action: Action) => void]>([
  defaultState,
  () => {},
]);

export const FiltersProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const state = useReducer(filtersReducer, defaultState);
  return (
    <FiltersContext.Provider value={state}>{children}</FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);
