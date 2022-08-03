import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { readUserFromStore } from "../states/auth";
import "./server";
import { addErrorNotification } from '../states/ui'


const authLink = setContext((_, { headers }) => {
  const user = readUserFromStore();
  return {
    headers: {
      ...headers,
      authorization: user ? `${user.email} ${user.token}` : "",
    }
  }
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (networkError) {
        console.warn(`[Network error]: ${networkError}`);
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>{
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
          addErrorNotification({message:  `[GraphQL error]: ${message}, Path: ${path}`})
        });
      }
    }),
    authLink,
    new HttpLink({ uri: "/graphql" }),
  ]),
  connectToDevTools: true,
});

