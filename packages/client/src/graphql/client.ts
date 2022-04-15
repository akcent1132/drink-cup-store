import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { range } from "lodash";
import {
  // addFakePlantings,
  createFilteringData,
  filters,
  openEventCards,
  plantings,
  selectedCropType,
} from "../contexts/FiltersContext";
import { PlantingData } from "../stories/NestedRows";
import { loader } from "graphql.macro";
import {
  Planting,
  StrictTypedTypePolicies,
} from "../graphql.generated";
import { shuffler } from "d3-array";
import seedrandom from "seedrandom";

const typeDefs = loader("./local.graphql");

const getPlantings = (cropType?: string) => {
  // if (!plantings().some((planting) => planting.cropType === cropType)) {
  //   addFakePlantings(cropType);
  // }

  return plantings().filter((planting) => !cropType || planting.cropType === cropType);
};

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
          return getPlantings().find(planting => planting.id === id);
        },
      },
      openEventCards: {
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;
          return openEventCards().filter(planting => planting.cropType === cropType);
        },
      },

      filters: {
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;

          console.log("read filters", cropType, filters().filter((f) => f.cropType === cropType))
          return filters().filter((f) => f.cropType === cropType);
        },
      },
    },
  },
  Filter: {
    fields: {
      plantings: {
        read(existing, options) {
          console.log("read Filter.plantings", {existing, options})
          return [{id: "-1"}]
        }
      }
    }
  },
  Planting: {
    fields: {
      matchingFilters: {
        read(existing, options) {
          console.log("read matchingFilters", {existing, options})
          return [{id: "-1"}]
        }
      }
    }
  }
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

setTimeout(() => client
.query({
  query: gql`
    query Test23 {
      test
      selectedCropType
      plantings(cropType: "corn") {
        id
        # matchingFilters {
        #   id
        # }
      }
      filters(cropType: "corn") @client {
        id
        plantings @client {
          id
        }
      }
    }
  `,
})
.then((result) => console.log("plantings", result)), 100)
