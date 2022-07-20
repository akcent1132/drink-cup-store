import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NestedRowsQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type NestedRowsQuery = { __typename?: 'Query', selectedCropType: string, highlightedPlantingId?: string | null, highlightedFilterId?: string | null, plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, plantingId: string, modusId?: string | null }> }>, filters: Array<{ __typename?: 'Filter', id: string, color: string, name: string, params: Array<{ __typename?: 'FilterParam', key: string, active: boolean, dataSource?: Types.FilterParamDataSource | null, value: { __typename: 'FilterValueOption', options: Array<string> } | { __typename: 'FilterValueRange', min: number, max: number } }>, plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, plantingId: string, modusId?: string | null }> }> }> };


export const NestedRowsDocument = gql`
    query NestedRows($cropType: String! = "") {
  selectedCropType @client @export(as: "cropType")
  plantings(cropType: $cropType) {
    id
    values {
      name
      value
      plantingId
      modusId
    }
  }
  highlightedPlantingId @client
  highlightedFilterId @client
  filters(cropType: $cropType) @client {
    id
    color
    name
    params {
      key
      active
      dataSource
      value {
        __typename
        ... on FilterValueRange {
          min
          max
        }
        ... on FilterValueOption {
          options
        }
      }
    }
    plantings {
      id
      values {
        name
        value
        plantingId
        modusId
      }
    }
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
export function useNestedRowsQuery(baseOptions?: Apollo.QueryHookOptions<NestedRowsQuery, NestedRowsQueryVariables>) {
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