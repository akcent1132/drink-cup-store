import { randomNormal } from "d3-random";
import { range, sample, sampleSize, uniqueId } from "lodash";
import React, { useContext, useReducer, useState } from "react";
import seedrandom from "seedrandom";
import { PlantingData } from "../stories/NestedRows";
import { RowData, ROWS } from "./rows";

let plantingDataId = 0;
export const createFilteringData = (
  filteringName: string,
  countMax = 12,
  stdMax = 2,
  meanMax = 5
): PlantingData[][] => {
  const rnd = seedrandom(filteringName);
  return range(rnd() * countMax).map(() => {
    const values: { name: string; value: number; id: string }[] = [];
    const id = (plantingDataId++).toString();
    const walk = (rows: RowData[]) => {
      for (const row of rows) {
        const rndValue = seedrandom(filteringName + row.name);
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
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
  }
};

let filterId = 0;
const createFilter = (color: string, name: string) => {
  const id = (++filterId).toString();
  return {
    id,
    name,
    color,
    cropType: sample(CROPS),
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
    plantings: createFilteringData(name, 12, 3, 2),
    draftParams: createFilterParams() as FilterParams | null,
    activeParams: null as FilterParams | null
  }
};

export type FilterParams = ReturnType<typeof createFilterParams>;
export type Filter = ReturnType<typeof createFilter>;

type Action =
  | { type: "new", color: string, name: string }
  | {
      type: "apply" | "delete" | "select";
      filterId: string;
    }
  | {
      type: "edit";
      filterId: string;
      params: FilterParams;
    };

const defaultState = Object.freeze({
  filters: [] as Filter[],
  selectedFilterId: null as string | null,
});

type State = typeof defaultState;

const filtersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new": {
      const filter = createFilter(action.color, action.name);
      return {
        filters: [...state.filters, filter],
        selectedFilterId: filter.id,
      };
    }
    case "select": {
      return {
        ...state,
        selectedFilterId: action.filterId,
      };
    }
    case "apply":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.filterId ? { ...f, activeParams: f.draftParams } : f
        ),
      };
    case "delete":
      return {
        selectedFilterId:
          state.selectedFilterId === action.filterId
            ? null
            : state.selectedFilterId,
        filters: state.filters.filter((f) =>  f.id !== action.filterId),
      };
    case "edit":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.id === action.filterId ? { ...f, draftParams: action.params } : f
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

export const CROPS = [
  "Apple: 48",
  "Beet: 244",
  "Blueberry: 36",
  "Bok Choi: 99",
  "Carrot: 122",
  "Grapes: 64",
  "Kale: 118",
  "Leeks: 61",
  "Lettuce: 96",
  "Mizuna: 10",
  "Mustard Greens: 30",
  "Oats: 234",
  "Peppers: 167",
  "Potato: 450",
  "Spinach: 60",
  "Butternut Squash : 9",
  "Swiss Chard: 96",
  "Tomato: 66",
  "Wheat: 187",
  "Zucchini: 259",
  "All Crops: 2459",
];

export const COLORS = [
  "Beigered",
  "Brown",
  "Green",
  "Orange",
  "Red",
  "Purple",
  "Brownpurple",
  "Brownred",
  "Yellow",
  "Orangered",
];


