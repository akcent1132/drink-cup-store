import { setupWorker, rest } from "msw";
import { buildClientSchema, graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Resolvers } from "./resolvers.generated";
import jsonSchema from "./schema.server.generated.json";
import { loadPlantings } from "./loaders/plantings";
import seedrandom from "seedrandom";
import { loadFarmOnboardings } from "./loaders/farmOnboardings";
import { loadEventDetails } from "./loaders/farmEvents";
import { loadAvailableCropTypes } from "./loaders/availableCropTypes";

// Construct a schema, using GraphQL schema language
// @ts-ignore
const typeDefs = buildClientSchema(jsonSchema);

// The root provides a resolver function for each API endpoint
const resolvers: Resolvers = {
  Query: {
    async allPlantings() {
      return await loadPlantings();
    },
    plantings: async (_, { cropType }) => {
      console.log("SERVER: get plantings of", cropType);
      const plantings = await loadPlantings();
      return plantings.filter((p) => p.cropType === cropType);
    },
    async planting(_, { id }) {
      const plantings = await loadPlantings();
      return plantings.find((p) => p.id === id) || null;
    },
    async producer(_, { id }) {
      if (!id) {
        return null;
      }
      return {
        id,
        code: seedrandom(id)().toString(32).slice(-7),
        plantings: [],
      };
    },
    async allFarmOnboardings() {
      return await loadFarmOnboardings();
    },
    async availableCropTypes() {
      return await loadAvailableCropTypes();
    }
  },
  Producer: {
    async plantings({ id }) {
      const plantings = await loadPlantings();
      return plantings.filter((p) => p.producer.id === id);
    },
  },
  Planting: {
    async farmOnboarding({ producer }) {
      return (
        (await loadFarmOnboardings()).find(
          (f) => f.farmDomain && f.farmDomain === producer.id
        ) || null
      );
    },
  },
  PlantingEvent: {
    async details({
      _producer_key_for_details_request,
      _planting_id_for_details_request,
      id,
    }) {
      const details = await loadEventDetails(
        _producer_key_for_details_request,
        _planting_id_for_details_request
      );
      return details.find((d) => d.id === id)?.details || [];
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const worker = setupWorker(
  rest.post("/login", (req, res, ctx) => {
    return res(
      ctx.json({
        firstName: "John",
      })
    );
  }),

  rest.post("/graphql", async (req, res, ctx) => {
    const { query, variables, operationName } = await req.json();
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
    });
    return res(ctx.json(result));
  })
);

// Register the Service Worker and enable the mocking

worker.start();
