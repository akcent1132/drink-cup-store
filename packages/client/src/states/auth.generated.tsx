import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResponse', success: boolean, error?: string | null, user?: { __typename?: 'AuthUser', id: string, token: string, name?: string | null, email: string } | null } | null };

export type UserPlantingsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserPlantingsQuery = { __typename?: 'Query', myFarms?: Array<{ __typename?: 'Producer', id: string, plantings: Array<{ __typename?: 'Planting', id: string, cropType: string }> } | null> | null };


export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    error
    user {
      id
      token
      name
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UserPlantingsDocument = gql`
    query UserPlantings {
  myFarms {
    id
    plantings {
      id
      cropType
    }
  }
}
    `;

/**
 * __useUserPlantingsQuery__
 *
 * To run a query within a React component, call `useUserPlantingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPlantingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPlantingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserPlantingsQuery(baseOptions?: Apollo.QueryHookOptions<UserPlantingsQuery, UserPlantingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserPlantingsQuery, UserPlantingsQueryVariables>(UserPlantingsDocument, options);
      }
export function useUserPlantingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserPlantingsQuery, UserPlantingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserPlantingsQuery, UserPlantingsQueryVariables>(UserPlantingsDocument, options);
        }
export type UserPlantingsQueryHookResult = ReturnType<typeof useUserPlantingsQuery>;
export type UserPlantingsLazyQueryHookResult = ReturnType<typeof useUserPlantingsLazyQuery>;
export type UserPlantingsQueryResult = Apollo.QueryResult<UserPlantingsQuery, UserPlantingsQueryVariables>;