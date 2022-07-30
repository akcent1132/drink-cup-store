import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddFilterButtonQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AddFilterButtonQuery = { __typename?: 'Query', connectedFarmIds: Array<string> };


export const AddFilterButtonDocument = gql`
    query AddFilterButton {
  connectedFarmIds
}
    `;

/**
 * __useAddFilterButtonQuery__
 *
 * To run a query within a React component, call `useAddFilterButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddFilterButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddFilterButtonQuery({
 *   variables: {
 *   },
 * });
 */
export function useAddFilterButtonQuery(baseOptions?: Apollo.QueryHookOptions<AddFilterButtonQuery, AddFilterButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddFilterButtonQuery, AddFilterButtonQueryVariables>(AddFilterButtonDocument, options);
      }
export function useAddFilterButtonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddFilterButtonQuery, AddFilterButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddFilterButtonQuery, AddFilterButtonQueryVariables>(AddFilterButtonDocument, options);
        }
export type AddFilterButtonQueryHookResult = ReturnType<typeof useAddFilterButtonQuery>;
export type AddFilterButtonLazyQueryHookResult = ReturnType<typeof useAddFilterButtonLazyQuery>;
export type AddFilterButtonQueryResult = Apollo.QueryResult<AddFilterButtonQuery, AddFilterButtonQueryVariables>;