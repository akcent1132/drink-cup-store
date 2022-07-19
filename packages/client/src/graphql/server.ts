import { setupWorker, rest } from "msw";
import { buildClientSchema, graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Resolvers } from "./resolvers.generated";
import jsonSchema from "./schema.server.generated.json";
import { loadPlantings } from "./loaders/plantings";
import seedrandom from "seedrandom";

// Construct a schema, using GraphQL schema language
// @ts-ignore
const typeDefs = buildClientSchema(jsonSchema);

// The root provides a resolver function for each API endpoint
const resolvers: Resolvers = {
  Query: {
    async allPlantings() {
      return await loadPlantings();
    },
    async plantings(_, { cropType }) {
      const plantings = await loadPlantings();
      return plantings.filter((p) => p.cropType === cropType);
    },
    async planting(_, { id }) {
      const plantings = await loadPlantings();
      return plantings.find((p) => p.id === id) || null;
    },
    async producer(_, { id }) {
      if (!id) {
        return null
      }
      return {
        id,
        code: seedrandom(id)().toString(32).slice(-7),
        plantings: [],
      };
    },
  },
  Producer: {
    async plantings({ id }) {
      const plantings = await loadPlantings();
      return plantings.filter((p) => p.producer.id === id);
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
