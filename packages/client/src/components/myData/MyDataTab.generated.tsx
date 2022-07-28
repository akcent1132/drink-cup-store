import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MyDataTabQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyDataTabQuery = { __typename?: 'Query', connectedFarmIds: Array<string> };


export const MyDataTabDocument = gql`
    query MyDataTab {
  connectedFarmIds
}
    `;

/**
 * __useMyDataTabQuery__
 *
 * To run a query within a React component, call `useMyDataTabQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyDataTabQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyDataTabQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyDataTabQuery(baseOptions?: Apollo.QueryHookOptions<MyDataTabQuery, MyDataTabQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyDataTabQuery, MyDataTabQueryVariables>(MyDataTabDocument, options);
      }
export function useMyDataTabLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyDataTabQuery, MyDataTabQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyDataTabQuery, MyDataTabQueryVariables>(MyDataTabDocument, options);
        }
export type MyDataTabQueryHookResult = ReturnType<typeof useMyDataTabQuery>;
export type MyDataTabLazyQueryHookResult = ReturnType<typeof useMyDataTabLazyQuery>;
export type MyDataTabQueryResult = Apollo.QueryResult<MyDataTabQuery, MyDataTabQueryVariables>;