const { ApolloServer } = require("apollo-server-lambda");
import { typeDefs, resolvers } from "../schema/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

const getHandler = (event: any, context: any) => {
  const graphqlHandler = server.createHandler();
  if (!event.requestContext) {
    event.requestContext = context;
  }
  return graphqlHandler(event, context);
};

exports.handler = getHandler;
