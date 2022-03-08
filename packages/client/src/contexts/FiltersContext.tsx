import { randomNormal } from "d3-random";
import { range, sample, sampleSize, uniqueId } from "lodash";
import React, { useContext, useReducer, useState } from "react";
import seedrandom from "seedrandom";
import { PlantingData, RowData } from "../stories/NestedRows";
import { ROWS } from "./rows";

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

let filterId = 0;
const createFilter = (color: string, name: string) => {
  const id = (++filterId).toString();
  return {
    id,
    name,
    color,
    cropType: sample(CROPS),
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
    data: createFilteringData(name, 12, 3, 2)
  }
};

export type Filter = ReturnType<typeof createFilter>;

type FilterState = {
  active?: Filter;
  draft?: Filter;
};

type Action =
  | { type: "new", color: string, name: string }
  | {
      type: "apply" | "delete" | "select";
      filterId: string;
    }
  | {
      type: "edit";
      filter: Filter;
    };

const createDefaultState = Object.freeze({
  filters: [] as FilterState[],
  selectedFilterId: null as string | null,
});

type State = typeof createDefaultState;

const filtersReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "new": {
      const filter = createFilter(action.color, action.name);
      return {
        filters: [...state.filters, {draft: filter}],
        selectedFilterId: filter.id,
      };
    }
    case "apply":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.draft?.id === action.filterId ? { ...f, active: f.draft } : f
        ),
      };
    case "delete":
      return {
        selectedFilterId:
          state.selectedFilterId === action.filterId
            ? null
            : state.selectedFilterId,
        filters: state.filters.filter(
          (f) => (f.draft?.id || f.active?.id) === action.filterId
        ),
      };
    case "edit":
      return {
        ...state,
        filters: state.filters.map((f) =>
          f.draft?.id === action.filter.id ? { ...f, draft: action.filter } : f
        ),
      };
  }
};



const FiltersContext = React.createContext<[State, (action: Action) => void]>([
  createDefaultState,
  () => {},
]);

export const FiltersProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const state = useReducer(filtersReducer, createDefaultState);
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


