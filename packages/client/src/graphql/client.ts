import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { range } from "lodash";
import { createFilteringData } from "../contexts/FiltersContext";
import { PlantingData } from "../stories/NestedRows";
import { loader } from "graphql.macro";
import { Planting } from "../generated/graphql";
import { shuffler } from "d3-array";
import seedrandom from "seedrandom";

const typeDefs = loader("./local.graphql");

const plantingsCache: { [key: string]: Planting[] } = {};
const getPlantings = (cropType: string) => {
  if (!plantingsCache[cropType]) {
    plantingsCache[cropType] = createFilteringData(cropType, 67, 3, 2).map(
      (values, i) => ({ id: `${cropType}-${i}`, values })
    );
  }
  return plantingsCache[cropType];
};

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        test: {
          read() {
            return true;
          },
        },
        plantings: {
          read(_, variables): Planting[] {
            // @ts-ignore
            const cropType: string = variables.args.cropType;
            return getPlantings(cropType);
          },
        },

        filter: {
          read(_, variables): Planting[] {
            // @ts-ignore
            const cropType: string = variables.args.cropType;
            // @ts-ignore
            const filter: string = variables.args.filter;

            const plantings = getPlantings(cropType);
            const rnd = seedrandom(filter);
            const shuffle = shuffler(rnd);
            const filteredPlantings = shuffle([...plantings]).slice(
              0,
              6 + 8 * rnd()
            );
            return filteredPlantings;
          },
        },
      },
    },
  },
});
export const client = new ApolloClient({
  cache,
  connectToDevTools: true,
  uri: "http://localhost:4000/graphql",

  typeDefs,
});

client
  .query({
    query: gql`
      query Test {
        test
        plantings(cropType: "corn")
      }
    `,
  })
  .then((result) => console.log("plantings", result));

