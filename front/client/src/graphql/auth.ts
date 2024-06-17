import { makeVar } from "@apollo/client";
import { AuthState } from "../graphql.generated";

export const authState = makeVar<AuthState>({
  isLoggedIn: false,
  __typename: "AuthState",
  user: null,
});
