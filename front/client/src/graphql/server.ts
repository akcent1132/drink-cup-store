
import { setupWorker, rest } from "msw";
import { buildClientSchema, graphql } from "graphql";
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Resolvers } from '../../../resolvers.generated'
import jsonSchema from './schema.server.generated.json'

// Construct a schema, using GraphQL schema language
// @ts-ignore
const typeDefs = buildClientSchema(jsonSchema);

// The root provides a resolver function for each API endpoint
const resolvers: Resolvers = {
  Query: {
    allPlantings() {
        return [];
    },
    plantings() {
        return [];
    },
    planting() {
        return null
    },

  },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

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
    return res(
      ctx.json(
        await graphql({
          schema,
          source: query,
          variableValues: variables,
          operationName,
        })
      )
    );
  })
);

// Register the Service Worker and enable the mocking

worker.start();
