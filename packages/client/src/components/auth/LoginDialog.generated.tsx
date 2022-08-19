import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RequestMagicLoginLinkMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type RequestMagicLoginLinkMutation = { __typename?: 'Mutation', requestMagicLoginLink?: { __typename?: 'RequestMagicLoginLinkResponse', success: boolean, error?: string | null } | null };


export const RequestMagicLoginLinkDocument = gql`
    mutation requestMagicLoginLink($email: String!) {
  requestMagicLoginLink(email: $email) {
    success
    error
  }
}
    `;
export type RequestMagicLoginLinkMutationFn = Apollo.MutationFunction<RequestMagicLoginLinkMutation, RequestMagicLoginLinkMutationVariables>;

/**
 * __useRequestMagicLoginLinkMutation__
 *
 * To run a mutation, you first call `useRequestMagicLoginLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestMagicLoginLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestMagicLoginLinkMutation, { data, loading, error }] = useRequestMagicLoginLinkMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRequestMagicLoginLinkMutation(baseOptions?: Apollo.MutationHookOptions<RequestMagicLoginLinkMutation, RequestMagicLoginLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestMagicLoginLinkMutation, RequestMagicLoginLinkMutationVariables>(RequestMagicLoginLinkDocument, options);
      }
export type RequestMagicLoginLinkMutationHookResult = ReturnType<typeof useRequestMagicLoginLinkMutation>;
export type RequestMagicLoginLinkMutationResult = Apollo.MutationResult<RequestMagicLoginLinkMutation>;
export type RequestMagicLoginLinkMutationOptions = Apollo.BaseMutationOptions<RequestMagicLoginLinkMutation, RequestMagicLoginLinkMutationVariables>;