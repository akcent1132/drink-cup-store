import { randomNormal } from "d3-random";
import { range, sample, sampleSize } from "lodash";
import React, { useContext, useReducer } from "react";
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
const createFilter = (color: string, name: string) => {
  const id = (++filterId).toString();
  return {
    id,
    name,
    groups: sampleSize(GROUPS, Math.random() * 3 + 1),
    color,
    cropType: sample(CROPS),
    colors: sampleSize(COLORS, Math.random() * 3 + 1),
    plantings: createFilteringData(name, 12, 3, 2),
    draftParams: createFilterParams() as FilterParams | null,
    activeParams: null as FilterParams | null,
  };
};

export type FilterParams = ReturnType<typeof createFilterParams>;
export type Filter = ReturnType<typeof createFilter>;

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

const filtersReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "new": {
      const filter = createFilter(action.color, action.name);
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
  "Beige",
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

export const CROP_VARIETY = [
  "Austrian Crescent",
  "Bonita",
  "Carola",
  "Laratte",
  "Loowit",
  "Phureja-- Andean",
  "Satina",
  "Adirondack Red",
  "Amarosa",
  "Bannock",
  "Caribe",
  "Carola",
  "Cheiftain",
  "Chioggia Guardsmark",
  "Dark Red Norland",
  "Ditta",
  "Elba",
  "Fingerling",
  "French Fingerling",
  "German Butterball",
  "Huckleberry",
  "Jester",
];

export const CLIMATE_REGION = [
  "Central",
  "East North Central",
  "Northeast",
  "Northwest",
  "Other",
  "South",
  "Southeast",
  "Southwest",
  "West",
  "West North Central",
];

export const SAMPLE_SOURCE = [
  "Farm",
  "Farm Market",
  "Farm Retail",
  "Garden",
  "Research Plots",
  "Store",
];

export const FARM_PRACTICES = [
  "Sheet Mulching",
  "None",
  "Covercrops",
  "Organic",
  "Regenerative",
  "Transitioning",
  "Biodynamic",
  "Biological",
  "Nospray",
  "Certified Organic",
  "Irrigation",
];

export const AMENDMENTS = [
  "Mulch",
  "Lime",
  "None",
  "Synth Fertilizer",
  "Organic Amendment",
];

export const LAND_PREPARATION = [
  "None",
  "Tillage",
  "Solarization",
  "Broadforking",
  "Sheet Mulching",
];

export const GROUPS = [
  "ANEI",
  "Bay Area Urban Farmers Association",
  "BeneficialBIO",
  "Bionutrient Institute",
  "BOTL Farm",
  "Carbofarm",
  "CCRP Soils Cross Cutting",
  "CEE",
  "CEPAGRO",
  "CFDN",
  "Cool Farm Tool",
  "corn growers association",
  "CRARS RAD-Lab, Chico State",
  "Demo",
  "farmOS",
  "Flavor",
  "General Mills Regen Ag",
  "GOSH",
  "Grupo chicas",
  "Honey Rock Landing",
  "Intecons Software",
  "landPKS",
  "Landscape Interactions",
  "LiteFarm - SPG project",
  "LiteFarm",
  "mdc-farmos2",
  "Million Acre Challenge",
  "MVP-Certifiers",
  "My Coffee Shop Group",
  "NACD Locally Led Conservation",
  "nexus",
  "NOFAMass ",
  "nx",
  "OMAFRA Topsoil",
  "OpenTEAM Equity",
  "OpenTEAM",
  "Our-Sci LLC",
  "Paicines Ranch",
  "Pasa",
  "Real Food Campaign (old)",
  "Reforestamos Mexico",
  "Regen Farmers Mutual",
  "Regen Future Capital",
  "Regen Network Development",
  "Regen1",
  "Rothamsted",
  "SHP",
  "Snapp Lab",
  "SOC Pilot",
  "Soil sensing and monitoring",
  "soilstack",
  "SRUC",
  "Stone Barns Center",
  "Stonyfield",
  "Svensk Kolinlagring",
  "Tech Matters",
  "TNPU",
  "Trial",
  "We Are For The Land",
];
