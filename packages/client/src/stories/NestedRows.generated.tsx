import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NestedRowsQueryVariables = Types.Exact<{
  cropType: Types.Scalars['String'];
}>;


export type NestedRowsQuery = { __typename?: 'Query', plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, plantingId: string, modusId?: string | null }>, farmOnboarding?: { __typename?: 'FarmOnboarding', id: string, values?: Array<{ __typename?: 'FarmOnboardingValue', key: string, values: Array<string> }> | null } | null }>, rows?: Array<{ __typename?: 'Row', name: string, hierarchy: Array<string>, isAggregatable?: boolean | null, unit?: string | null, modusTestId?: string | null } | null> | null };


export const NestedRowsDocument = gql`
    query NestedRows($cropType: String!) {
  plantings(cropType: $cropType) {
    id
    values {
      name
      value
      plantingId
      modusId
    }
    farmOnboarding {
      id
      values {
        key
        values
      }
    }
  }
  rows {
    name
    hierarchy
    isAggregatable
    unit
    modusTestId
  }
}
    `;

/**
 * __useNestedRowsQuery__
 *
 * To run a query within a React component, call `useNestedRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNestedRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNestedRowsQuery({
 *   variables: {
 *      cropType: // value for 'cropType'
 *   },
 * });
 */
export function useNestedRowsQuery(baseOptions: Apollo.QueryHookOptions<NestedRowsQuery, NestedRowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NestedRowsQuery, NestedRowsQueryVariables>(NestedRowsDocument, options);
      }
export function useNestedRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NestedRowsQuery, NestedRowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NestedRowsQuery, NestedRowsQueryVariables>(NestedRowsDocument, options);
        }
export type NestedRowsQueryHookResult = ReturnType<typeof useNestedRowsQuery>;
export type NestedRowsLazyQueryHookResult = ReturnType<typeof useNestedRowsLazyQuery>;
export type NestedRowsQueryResult = Apollo.QueryResult<NestedRowsQuery, NestedRowsQueryVariables>;