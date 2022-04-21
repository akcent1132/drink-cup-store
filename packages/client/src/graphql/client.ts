import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { groupBy, memoize, range, remove } from "lodash";
import {
  filters,
  highlightedFilterId,
  highlightedPlantingId,
  openEventCards,
  plantings,
  selectedCropType,
} from "../contexts/FiltersContext";
import { loader } from "graphql.macro";
import {
  Filter,
  FilterParams,
  Planting,
  StrictTypedTypePolicies,
} from "../graphql.generated";
import { shuffler } from "d3-array";
import seedrandom from "seedrandom";

const typeDefs = loader("./local.graphql");

const getPlantings = (cropType: string) => {
  // if (!plantings().some((planting) => planting.cropType === cropType)) {
  //   addFakePlantings(cropType);
  // }

  return plantings().filter((planting) => planting.cropType === cropType);
};

const plantingsOfFilterCache: {
  [key: string]: { hash: string; plantings: Planting[] };
} = {};

const getPlantingsOfFilter = (
  id: string,
  cropType: string,
  activeParams: FilterParams | null
) => {
  const plantings = getPlantings(cropType);
  const hash = `${cropType}-${JSON.stringify(activeParams)}-${
    plantings.length
  }-${id}`;
  if (plantingsOfFilterCache[id]?.hash !== hash) {
    const rnd = seedrandom(hash);
    const portion = 0.03 + 0.07 * rnd();
    plantingsOfFilterCache[id] = {
      hash,
      plantings: plantings.filter(() => rnd() < portion),
    };
  }

  return plantingsOfFilterCache[id].plantings;
};

const getGroupedValues = memoize((cropType) => {
  const unmatchedPlantings = getPlantings(cropType);
  const cropFilters = filters()
    .filter((f) => f.cropType === cropType)
    .map((filter) => {
      const matchingPlantingIds = getPlantingsOfFilter(
        filter.id,
        filter.cropType,
        filter.activeParams
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
    id: filter?.id || 'unmatched_values',
    filter,
    values: plantings.map((planting) => planting.values).flat(),
  }));
  return groupedValues
})

const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      test: {
        read() {
          return true;
        },
      },
      selectedCropType: {
        read(): string {
          return selectedCropType();
        },
      },
      plantings: {
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;
          return getPlantings(cropType);
        },
      },
      planting: {
        read(_, variables) {
          // @ts-ignore
          const id: string = variables.args.id;
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
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;
          return openEventCards().filter(
            (planting) => planting.cropType === cropType
          );
        },
      },
      filters: {
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;
          return filters().filter((f) => f.cropType === cropType);
        },
      },
      groupedValues(_, variables) {
        console.log("get grouped values")
        // @ts-ignore
        const cropType: string = variables.args.cropType;
        return getGroupedValues(cropType)
        
      },
    },
  },
  Filter: {
    fields: {
      plantings: {
        read(_, { readField }) {
          const id = readField<string>("id") || "";
          const cropType = readField<string>("cropType") || "";
          const activeParams = readField<FilterParams>("activeParams") || null;
          return getPlantingsOfFilter(id, cropType, activeParams);
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
              filter.activeParams
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
};

const cache = new InMemoryCache({
  typePolicies,
});
export const client = new ApolloClient({
  cache,
  connectToDevTools: true,
  // uri: "http://localhost:4000/graphql",
  typeDefs,
});

setTimeout(
  () =>
    client
      .query({
        query: gql`
          query Test23 {
            test
            selectedCropType
            plantings(cropType: "corn") {
              id
            }
            groupedValues(cropType: "corn") {
              id
              filter {
                name
              }
              values {
                name
                plantingId
              }
            }
            filters(cropType: "corn") @client {
              color
              plantings {
                id
              }
            }
          }
        `,
      })
      .then((result) => console.log("plantings", result)),
  100
);

