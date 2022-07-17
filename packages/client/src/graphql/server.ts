import { setupWorker, rest } from "msw";
import { buildSchema, graphql } from "graphql";

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

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
          rootValue,
          variableValues: variables,
          operationName,
        })
      )
    );
  })
);

// Register the Service Worker and enable the mocking

worker.start();
