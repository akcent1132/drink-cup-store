import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { get, remove } from "lodash";
import {
  eventDetailsMap,
  farmProfiles,
  filters,
  highlightedFilterId,
  highlightedPlantingId,
  isDemo,
  loadEventDetails,
  openEventCardIds,
  plantings,
  producers,
  selectedCropType,
  selectedFilterId,
  selectedProducerId,
} from "../contexts/FiltersContext";
import { loader } from "graphql.macro";
import {
  FilterParam,
  FilterParamDataSource,
  Planting,
  Producer,
  StrictTypedTypePolicies,
} from "../graphql.generated";
import seedrandom from "seedrandom";
import { authState } from "./auth";
import "./server"

const typeDefs = loader("./local.graphql");

const getPlantings = (cropType: string) => {
  return plantings().filter((planting) => planting.cropType === cropType);
};

const plantingsOfFilterCache: {
  [key: string]: { hash: string; plantings: Planting[] };
} = {};

// Matching rules
// - Range values math if
//   - planting has any value (with the given key) in the given range
//   - planting has no value with the given key
// - Option values match
//   - if the planting has a matching value (with the given key) with the selected option
const getPlantingsOfFilter = (
  id: string,
  cropType: string,
  params: FilterParam[]
) => {
  let filteredPlantings = getPlantings(cropType);

  let farms = farmProfiles();

  const hash = `${cropType}-${JSON.stringify(params)}-${
    filteredPlantings.length
  }-${id}`;

  if (plantingsOfFilterCache[id]?.hash !== hash) {
    const activeParams = params.filter((p) => p.active);
    console.log({ activeParams });
    if (activeParams.length === 0) {
      filteredPlantings = [];
    } else {
      for (const param of activeParams) {
        const { value } = param;
        if (value.__typename === "FilterValueRange") {
          filteredPlantings = filteredPlantings.filter((p) => {
            const values =
              param.dataSource === FilterParamDataSource.Values
                ? p.values.filter((v) => v.name === param.key)
                : [get(farms, [p.producer.id, param.key])].flat();
            return values.every(
              (v) => v.value >= value.min && v.value <= value.max
            );
          });
        } else if (value.__typename === "FilterValueOption") {
          filteredPlantings = filteredPlantings.filter((p) => {
            const optionsInPlanting = [
              get(farms, [p.producer.id, param.key]),
            ].flat();
            if (optionsInPlanting.filter(Boolean).length) {
              console.log(p.producer.id, param.key, { optionsInPlanting });
            }
            return optionsInPlanting.some((o) => value.options.includes(o));
          });
        }
      }
    }

    plantingsOfFilterCache[id] = {
      hash,
      plantings: filteredPlantings,
    };
  }

  return plantingsOfFilterCache[id].plantings;
};

const getGroupedValues = (cropType: string) => {
  const unmatchedPlantings = getPlantings(cropType);
  const cropFilters = filters()
    .filter((f) => f.cropType === cropType)
    .map((filter) => {
      const matchingPlantingIds = getPlantingsOfFilter(
        filter.id,
        filter.cropType,
        filter.params
      ).map((p) => p.id);
      const matchingPlantings = remove(unmatchedPlantings, (p) =>
        matchingPlantingIds.includes(p.id)
      );
      return {
        filter,
        plantings: matchingPlantings,
      };
    });
  const groupedValues = [
    { filter: null, plantings: unmatchedPlantings },
    ...cropFilters,
  ].map(({ filter, plantings }) => ({
    id: filter?.id || "unmatched_values",
    filter,
    values: plantings.map((planting) => planting.values).flat(),
  }));
  return groupedValues;
};

const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      auth: {
        read() {
          return authState();
        },
      },
      selectedCropType: {
        read(): string {
          return selectedCropType();
        },
      },
      plantings: {
        read(_, options) {
          // @ts-ignore
          const cropType: string = options.args.cropType;
          return getPlantings(cropType);
        },
      },
      allPlantings: {
        read() {
          return plantings();
        },
      },
      planting: {
        read(_, options) {
          // @ts-ignore
          const id: string = options.args.id;
          return plantings().find((planting) => planting.id === id) || null;
        },
      },
      highlightedPlanting: {
        read() {
          const id = highlightedPlantingId();
          return plantings().find((planting) => planting.id === id) || null;
        },
      },
      highlightedFilter: {
        read() {
          const id = highlightedFilterId();
          return filters().find((filter) => filter.id === id) || null;
        },
      },
      openEventCards: {
        read(_, options) {
          // @ts-ignore
          const cropType: string = options.args.cropType;
          if (!cropType) {
            return null;
          }
          const cropPlantings = plantings().filter(
            (planting) => planting.cropType === cropType
          );
          return openEventCardIds()
            .map((id) => cropPlantings.find((p) => p.id === id))
            .filter(Boolean);
        },
      },
      filters: {
        read(_, options) {
          // @ts-ignore
          const cropType: string = options.args.cropType;
          return filters().filter((f) => f.cropType === cropType);
        },
      },
      filter: {
        read(_, options) {
          // @ts-ignore
          const id: string = options.args.id;
          return filters().find((filter) => filter.id === id) || null;
        },
      },
      groupedValues(_, options) {
        // @ts-ignore
        const cropType: string = options.args.cropType;
        const hash =
          filters()
            .filter((f) => f.cropType === cropType)
            .map((filter) => JSON.stringify(filter.params))
            .join() + plantings().length;

        const [cacheHash, cacheGroupedValues] = options.storage[cropType] || [];
        if (cacheHash === hash) {
          return cacheGroupedValues;
        } else {
          const groupedValues = getGroupedValues(cropType);
          options.storage[cropType] = [hash, groupedValues];
          return groupedValues;
        }
      },
      selectedFilter() {
        const id = selectedFilterId();
        return filters().find((f) => f.id === id) || null;
      },
      selectedProducer() {
        const id = selectedProducerId();
        return producers().find((p) => p.id === id) || null;
      },
    },
  },
  Filter: {
    fields: {
      plantings: {
        read(_, { readField }) {
          const id = readField<string>("id") || "";
          const cropType = readField<string>("cropType") || "";
          const params = readField<FilterParam[]>("params") || [];
          return getPlantingsOfFilter(id, cropType, [...params]);
        },
      },
      isHighlighted: {
        read(_, { readField }) {
          const id = readField<string>("id");
          return id === highlightedFilterId();
        },
      },
    },
  },
  Planting: {
    fields: {
      matchingFilters: {
        read(_, { readField }) {
          const id = readField<string>("id");
          return filters().filter((filter) =>
            getPlantingsOfFilter(
              filter.id,
              filter.cropType,
              filter.params
            ).some((planting) => planting.id === id)
          );
        },
      },
      isHighlighted: {
        read(_, { readField }) {
          const id = readField<string>("id");
          return id === highlightedPlantingId();
        },
      },
    },
  },
  PlantingEvent: {
    fields: {
      details: {
        read(_, { readField }) {
          if (isDemo()) {
            return FAKE_PLANTING_DETAILS;
          }
          const detailsKey = readField<string | null>("detailsKey");
          const [producerKey, plantingId] = (detailsKey || "").split("/");
          loadEventDetails(producerKey, plantingId);
          // console.log("ED", detailsKey, eventDetailsMap()[detailsKey || ""]);
          const details = eventDetailsMap[detailsKey || ""];
          return (details && details()) || null;
        },
      },
    },
  },
  Producer: {
    fields: {
      plantings: {
        read(_, { readField }) {
          const producerId = readField<string>("id") || "";
          return plantings().filter((p) => p.producer.id === producerId);
        },
      },
    },
  },
};

const FAKE_PLANTING_DETAILS = [
  { name: "Name", value: "Herbicide Spark 65P 30 liter_acre" },
  {
    name: "Notes",
    value:
      "Added 300 liters of Spark total but diluted it with extra water for this field.",
  },
  { name: "Quantity 1", value: "Spark 65P (rate) 30 litre_acre" },
  { name: "Quantity 2", value: "Spark 65P (quantity) 300 litre" },
  { name: "Material 1", valueList: ["Spark 65P"] },
  { name: "Flags", value: null, valueList: ["Greenhouse", "Organic"] },
].map((d) => ({
  value: null,
  valueList: null,
  ...d,
  __typename: "PlantingEventDetail",
}));

const cache = new InMemoryCache({
  typePolicies,
});
export const client = new ApolloClient({
  cache,
  connectToDevTools: true,
  // uri: "http://localhost:4000/graphql",
  typeDefs,
});
