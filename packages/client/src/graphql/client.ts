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

const typeDefs = loader("./local.graphql");

const plantingsCache: { [key: string]: Planting[] } = {};

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
            const cropType: string = variables.cropType;

            if (!plantingsCache[cropType]) {
              plantingsCache[cropType] = createFilteringData(
                cropType,
                45,
                3,
                2
              ).map(values => ({values}));
            }
            return plantingsCache[cropType]
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

  .then((result) => console.log(result));
