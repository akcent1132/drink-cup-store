import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  highlightedFilterId,
} from "../contexts/FiltersContext";
import { loader } from "graphql.macro";
import {
  StrictTypedTypePolicies,
} from "../graphql.generated";
import "./server";
import { memoize } from "lodash";

const typeDefs = loader("./local.graphql");

const keyHashMemoize = (...args: Parameters<typeof memoize>) => {
  const [func, resolver] = args;
  const memoized = memoize(func, resolver);
  const map = new Map<string, [string, any]>();
  memoized.cache = {
    clear: () => map.clear(),
    delete: ([key, _]: [string, string]) => map.delete(key),
    get: ([key, hash]: [string, string]) => {
      console.log("*GET", key, hash);
      const record = map.get(key);
      if (record && record[0] === hash) {
        return record[1];
      }
    },
    has: ([key, hash]: [string, string]) => {
      console.log("*HAS", key, hash);
      return map.has(key) && map.get(key)![0] === hash;
    },
    set: ([key, hash]: [string, string], value: any) => {
      console.log("*SET", key, hash);
      return map.set(key, [hash, value]);
    },
  };
  return memoized;
};

// const keyHashMemo = <T impt, K>(fn: (...args: T) => K, key, hash) => {

// }

const typePolicies: StrictTypedTypePolicies = {
  Query: {
    fields: {
      // auth: {
      //   read() {
      //     return authState();
      //   },
      // },
      // selectedCropType: {
      //   read(): string {
      //     console.log("read selectedCropType", selectedCropType());
      //     return selectedCropType();
      //   },
      // },
      // highlightedPlantingId: {
      //   read() {
      //     return highlightedPlantingId();
      //   },
      // },
      highlightedFilterId: {
        read() {
          return highlightedFilterId();
        },
      },
      // openEventCardIds: {
      //   read(_, options) {
      //     return openEventCardIds();
      //     // // @ts-ignore
      //     // const cropType: string = options.args.cropType;
      //     // if (!cropType) {
      //     //   return null;
      //     // }
      //     // const cropPlantings = plantings().filter(
      //     //   (planting) => planting.cropType === cropType
      //     // );
      //     // return openEventCardIds()
      //     //   .map((id) => cropPlantings.find((p) => p.id === id))
      //     //   .filter(Boolean);
      //   },
      // },
      // selectedFilterId() {
      //   return selectedFilterId();
      // },
      // selectedProducerId() {
      //   return selectedProducerId();
      // },
    },
  },
  Filter: {
    fields: {
      isHighlighted: {
        read(_, { readField }) {
          const id = readField<string>("id");
          return id === highlightedFilterId();
        },
      },
    },
  },
  // Planting: {
  //   fields: {
  //     isHighlighted: {
  //       read(_, { readField }) {
  //         const id = readField<string>("id");
  //         return id === highlightedPlantingId();
  //       },
  //     },
  //   },
  // },
  // PlantingEvent: {
  //   fields: {
  //     details: {
  //       read(_, { readField }) {
  //         if (isDemo()) {
  //           return FAKE_PLANTING_DETAILS;
  //         }
  //         const detailsKey = readField<string | null>("detailsKey");
  //         const [producerKey, plantingId] = (detailsKey || "").split("/");
  //         loadEventDetails(producerKey, plantingId);
  //         // console.log("ED", detailsKey, eventDetailsMap()[detailsKey || ""]);
  //         const details = eventDetailsMap[detailsKey || ""];
  //         return (details && details()) || null;
  //       },
  //     },
  //   },
  // },
};

// const FAKE_PLANTING_DETAILS = [
//   { name: "Name", value: "Herbicide Spark 65P 30 liter_acre" },
//   {
//     name: "Notes",
//     value:
//       "Added 300 liters of Spark total but diluted it with extra water for this field.",
//   },
//   { name: "Quantity 1", value: "Spark 65P (rate) 30 litre_acre" },
//   { name: "Quantity 2", value: "Spark 65P (quantity) 300 litre" },
//   { name: "Material 1", valueList: ["Spark 65P"] },
//   { name: "Flags", value: null, valueList: ["Greenhouse", "Organic"] },
// ].map((d) => ({
//   value: null,
//   valueList: null,
//   ...d,
//   __typename: "PlantingEventDetail",
// }));

const cache = new InMemoryCache({
  typePolicies,
});

export const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (networkError) {
        console.warn(`[Network error]: ${networkError}`);
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
    }),
    new HttpLink({ uri: "/graphql" }),
  ]),
  connectToDevTools: true,
  // uri: "/graphql",
  typeDefs,
});

// @ts-ignore DEBUG
global.client = client;
// @ts-ignore DEBUG
global.gql = gql;
