import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FilterEditorQueryVariables = Types.Exact<{
  filterId: Types.Scalars['String'];
}>;


export type FilterEditorQuery = { __typename?: 'Query', filter?: { __typename?: 'Filter', id: string, color: string, name: string, params: Array<{ __typename?: 'FilterParam', key: string, active: boolean, modusId?: string | null, dataSource?: Types.FilterParamDataSource | null, value: { __typename: 'FilterValueOption', allOptions: Array<string>, options: Array<string> } | { __typename: 'FilterValueRange', min: number, max: number, values: Array<number> } }> } | null };


export const FilterEditorDocument = gql`
    query FilterEditor($filterId: String!) {
  filter(id: $filterId) {
    id
    color
    name
    params {
      key
      active
      modusId
      dataSource
      value {
        __typename
        ... on FilterValueRange {
          min
          max
          values
        }
        ... on FilterValueOption {
          allOptions
          options
        }
      }
    }
  }
}
    `;

/**
 * __useFilterEditorQuery__
 *
 * To run a query within a React component, call `useFilterEditorQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilterEditorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilterEditorQuery({
 *   variables: {
 *      filterId: // value for 'filterId'
 *   },
 * });
 */
export function useFilterEditorQuery(baseOptions: Apollo.QueryHookOptions<FilterEditorQuery, FilterEditorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FilterEditorQuery, FilterEditorQueryVariables>(FilterEditorDocument, options);
      }
export function useFilterEditorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilterEditorQuery, FilterEditorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FilterEditorQuery, FilterEditorQueryVariables>(FilterEditorDocument, options);
        }
export type FilterEditorQueryHookResult = ReturnType<typeof useFilterEditorQuery>;
export type FilterEditorLazyQueryHookResult = ReturnType<typeof useFilterEditorLazyQuery>;
export type FilterEditorQueryResult = Apollo.QueryResult<FilterEditorQuery, FilterEditorQueryVariables>;