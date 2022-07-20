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
  FilterParam,
  FilterParamDataSource,
  Planting,
  StrictTypedTypePolicies,
} from "../graphql.generated";
import { authState } from "./auth";
import "./server";

const typeDefs = loader("./local.graphql");

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
  return [];
  // let filteredPlantings = getPlantings(cropType);

  // let farms = farmProfiles();

  // const hash = `${cropType}-${JSON.stringify(params)}-${
  //   filteredPlantings.length
  // }-${id}`;

  // if (plantingsOfFilterCache[id]?.hash !== hash) {
  //   const activeParams = params.filter((p) => p.active);
  //   console.log({ activeParams });
  //   if (activeParams.length === 0) {
  //     filteredPlantings = [];
  //   } else {
  //     for (const param of activeParams) {
  //       const { value } = param;
  //       if (value.__typename === "FilterValueRange") {
  //         filteredPlantings = filteredPlantings.filter((p) => {
  //           const values =
  //             param.dataSource === FilterParamDataSource.Values
  //               ? p.values.filter((v) => v.name === param.key)
  //               : [get(farms, [p.producer.id, param.key])].flat();
  //           return values.every(
  //             (v) => v.value >= value.min && v.value <= value.max
  //           );
  //         });
  //       } else if (value.__typename === "FilterValueOption") {
  //         filteredPlantings = filteredPlantings.filter((p) => {
  //           const optionsInPlanting = [
  //             get(farms, [p.producer.id, param.key]),
  //           ].flat();
  //           if (optionsInPlanting.filter(Boolean).length) {
  //             console.log(p.producer.id, param.key, { optionsInPlanting });
  //           }
  //           return optionsInPlanting.some((o) => value.options.includes(o));
  //         });
  //       }
  //     }
  //   }

  //   plantingsOfFilterCache[id] = {
  //     hash,
  //     plantings: filteredPlantings,
  //   };
  // }

  // return plantingsOfFilterCache[id].plantings;
};

// const getGroupedValues = (cropType: string) => {
//   const unmatchedPlantings = getPlantings(cropType);
//   const cropFilters = filters()
//     .filter((f) => f.cropType === cropType)
//     .map((filter) => {
//       const matchingPlantingIds = getPlantingsOfFilter(
//         filter.id,
//         filter.cropType,
//         filter.params
//       ).map((p) => p.id);
//       const matchingPlantings = remove(unmatchedPlantings, (p) =>
//         matchingPlantingIds.includes(p.id)
//       );
//       return {
//         filter,
//         plantings: matchingPlantings,
//       };
//     });
//   const groupedValues = [
//     { filter: null, plantings: unmatchedPlantings },
//     ...cropFilters,
//   ].map(({ filter, plantings }) => ({
//     id: filter?.id || "unmatched_values",
//     filter,
//     values: plantings.map((planting) => planting.values).flat(),
//   }));
//   return groupedValues;
// };

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
      // plantings: {
      //   read(_, options) {
      //     // @ts-ignore
      //     const cropType: string = options.args.cropType;
      //     return getPlantings(cropType);
      //   },
      // },
      // allPlantings: {
      //   read() {
      //     return plantings();
      //   },
      // },
      // planting: {
      //   read(_, options) {
      //     // @ts-ignore
      //     const id: string = options.args.id;
      //     return plantings().find((planting) => planting.id === id) || null;
      //   },
      // },
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
              //@ts-ignore
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
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
