import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { range } from "lodash";
import seedrandom from "seedrandom";
import { createFilteringData } from "../contexts/FiltersContext";
import { PlantingData } from "../stories/NestedRows";
import { loader } from 'graphql.macro';

const typeDefs = loader('./local.graphql')

const plantingsCache: {[key: string]: PlantingData[][]} = {};

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
          // @ts-ignore
          read(_, variables) {
            // @ts-ignore
            const cropType: string = variables.cropType;
            const rnd = seedrandom(cropType);

            // @ts-ignore
            if (!plantingsCache[cropType]) {
              // @ts-ignore
              plantingsCache[cropType] = [];
            }
            return range(30 + 30 * rnd()).map((i) => {
              // @ts-ignore
              if (!plantingsCache[cropType][i]) {
                // @ts-ignore
                plantingsCache[cropType][i] = createFilteringData(
                  `${cropType}-${i}`,
                  12,
                  3,
                  2
                );
              }

              // @ts-ignore
              return plantingsCache[cropType][i];
            });
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

