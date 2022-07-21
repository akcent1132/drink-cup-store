import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  eventDetailsMap,
  farmProfiles,
  filters,
  highlightedFilterId,
  highlightedPlantingId,
  isDemo,
  loadEventDetails,
  openEventCardIds,
  producers,
  selectedCropType,
  selectedFilterId,
  selectedProducerId,
} from "../contexts/FiltersContext";
import { loader } from "graphql.macro";
import {
  Filter,
  FilterParam,
  FilterParamDataSource,
  Planting,
  StrictTypedTypePolicies,
} from "../graphql.generated";
import { authState } from "./auth";
import "./server";
import { getPlantingsOfFilterVar } from "./processors/filter";

const typeDefs = loader("./local.graphql");

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
          console.log("read selectedCropType", selectedCropType());
          return selectedCropType();
        },
      },
      highlightedPlantingId: {
        read() {
          return highlightedPlantingId();
        },
      },
      highlightedFilterId: {
        read() {
          return highlightedFilterId();
        },
      },
      openEventCardIds: {
        read(_, options) {
          return openEventCardIds();
          // // @ts-ignore
          // const cropType: string = options.args.cropType;
          // if (!cropType) {
          //   return null;
          // }
          // const cropPlantings = plantings().filter(
          //   (planting) => planting.cropType === cropType
          // );
          // return openEventCardIds()
          //   .map((id) => cropPlantings.find((p) => p.id === id))
          //   .filter(Boolean);
        },
      },
      filters: {
        read(_, options): Filter[] {
          // @ts-ignore
          const cropType: string = options.args.cropType;
          return filters().filter((f) => f.cropType === cropType);
        },
      },
      filter: {
        read(_, options) {
          // @ts-ignore
          const id: string = options.args.id;
          return filters().find((f) => f.id === id) || null;
        },
      },
      selectedFilterId() {
        return selectedFilterId();
      },
      selectedProducerId() {
        return selectedProducerId();
      },
    },
  },
  Filter: {
    fields: {
      plantings: {
        read(_, { readField }) {
          const id = readField<string>("id") || "";
          const cropType = readField<string>("cropType") || "";
          return getPlantingsOfFilterVar(id, cropType)().plantings
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
