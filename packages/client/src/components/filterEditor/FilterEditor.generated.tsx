import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FilterEditorQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type FilterEditorQuery = { __typename?: 'Query', plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, modusId?: string | null }>, farmOnboarding?: { __typename?: 'FarmOnboarding', values: Array<{ __typename?: 'FarmOnboardingValue', key: string, values: Array<string> }> } | null }> };


export const FilterEditorDocument = gql`
    query FilterEditor($cropType: String! = "") {
  plantings(cropType: $cropType) {
    id
    values {
      name
      value
      modusId
    }
    farmOnboarding {
      values {
        key
        values
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
 *      cropType: // value for 'cropType'
 *   },
 * });
 */
export function useFilterEditorQuery(baseOptions?: Apollo.QueryHookOptions<FilterEditorQuery, FilterEditorQueryVariables>) {
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