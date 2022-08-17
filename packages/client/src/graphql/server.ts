import { setupWorker, rest } from "msw";
import { buildClientSchema, graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Planting, Resolvers } from "./resolvers.generated";
import jsonSchema from "./schema.server.generated.json";
import {
  loadPlanting,
  loadPlantings,
  loadPlantingsOfCrop,
} from "./loaders/plantings";
import seedrandom from "seedrandom";
import { loadFarmOnboardings } from "./loaders/farmOnboardings";
import { loadEventDetails } from "./loaders/farmEvents";
import { loadAvailableCropTypes } from "./loaders/availableCropTypes";
import { z } from "zod";
import { loadConnectedFarmIds } from "./loaders/connectedFarms";
import { loadSurveyStackGroups } from "./loaders/surveyStackGroups";

// Construct a schema, using GraphQL schema language
// @ts-ignore
const typeDefs = buildClientSchema(jsonSchema);

const UserPayload = z.object({
  email: z.string(),
  name: z.string(),
  token: z.string(),
  _id: z.string(),
});

type Context = {
  authorization?: string;
};

// The root provides a resolver function for each API endpoint
const resolvers: Resolvers = {
  Query: {
    async allPlantings() {
      return await loadPlantings();
    },
    plantings: async (_, { cropType }) => {
      const plantings = await loadPlantingsOfCrop(cropType);
      if (plantings.length === 0) {
        throw new Error(`Can't find any data with crop type: "${cropType}"`);
      }
      return plantings;
    },
    async planting(_, { id }) {
      const planting = await loadPlanting(id);
      console.error(`Can't find planting with ID: ${id}`);
      return planting;
    },
    async plantingsById(_, { ids }) {
      return (await Promise.all(ids.map((id) => loadPlanting(id)))).filter(
        (p): p is Planting => !!p
      );
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
    },
    async connectedFarmIds(_: any, {}, { authorization }: Context) {
      console.log({ authorization });
      return await loadConnectedFarmIds(authorization);
    },
    async surveyStackGroups(_: any, { userId }, { authorization }: Context) {
      return await loadSurveyStackGroups(userId, authorization);
    },
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
    async details({ id }) {
      return await loadEventDetails(id);
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      return await fetch(
        `${process.env.REACT_APP_SURVEY_STACK_API_URL}api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      )
        .then((res) =>
          res.ok
            ? res.json()
            : res.json().then((e) => {
                throw e?.message || JSON.stringify(e);
              })
        )
        .then((res) => UserPayload.parse(res))
        .then(({ _id: id, email, name, token }) => ({
          success: true,
          user: { id, token, email, name },
        }))
        .catch((e) => {
          console.error("Login error:", e);
          return {
            success: false,
            error: e.toString(),
          };
        });
    },

    //   async loginWithMagicLink(_, { email }) {
    //     return await fetch(`${process.env.REACT_APP_SURVEY_STACK_API_URL}api/auth/login`, {
    //       method: "POST",
    //       body: JSON.stringify({ email, password }),
    //       headers: {
    //         "Content-Type": "application/json;charset=utf-8",
    //       },
    //     })
    //       .then((res) =>
    //         res.ok
    //           ? res.json()
    //           : res.json().then((e) => {
    //               throw e?.message || JSON.stringify(e);
    //             })
    //       )
    //       .then((res) => UserPayload.parse(res))
    //       .then(({ _id: id, email, name, token }) => ({
    //         success: true,
    //         user: { id, token, email, name },
    //       }))
    //       .catch((e) => {
    //         console.error("LOgin error:", e);
    //         return {
    //           success: false,
    //           error: e.toString(),
    //         };
    //       });
    //   },
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
      contextValue: {
        authorization: req.headers.get("authorization"),
      },
    });
    return res(ctx.json(result));
  })
);

// Register the Service Worker and enable the mocking

worker.start();
