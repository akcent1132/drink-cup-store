import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { range } from "lodash";
import {
  // addFakePlantings,
  createFilteringData,
  filters,
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

const plantingsCache: { [key: string]: Planting[] } = {};
const getPlantings = (cropType: string) => {
  // if (!plantings().some((planting) => planting.cropType === cropType)) {
  //   addFakePlantings(cropType);
  // }

  return plantings().filter((planting) => planting.cropType === cropType);
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
          console.log("read plantings", cropType, plantings())
          return getPlantings(cropType);
        },
      },

      filters: {
        read(_, variables) {
          // @ts-ignore
          const cropType: string = variables.args.cropType;

          console.log("read filters", cropType)
          return filters().filter((f) => f.cropType === cropType);
        },
      },
    },
  },
  Filter: {
    fields: {
      plantings: {
        read(existing, options) {
          console.log({existing, options})
          return []
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
  uri: "http://localhost:4000/graphql",
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
        values
      }
      filters(cropType: "corn") {
        id
        plantings {
          id
        }
      }
    }
  `,
})
.then((result) => console.log("plantings", result)), 100)
