
const { ApolloServer, gql } = require("apollo-server-lambda");
import { typeDefs, resolvers } from "../schema/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers
});

exports.handler = server.createHandler();