import * as Types from '../../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PlantingsQueryVariables = Types.Exact<{
  cropType: Types.Scalars['String'];
  filterId: Types.Scalars['String'];
}>;


export type PlantingsQuery = { __typename?: 'Query', plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, plantingId: string, modusId?: string | null }>, producer: { __typename?: 'Producer', id: string } }>, filter?: { __typename?: 'Filter', id: string, color: string, name: string, params: Array<{ __typename?: 'FilterParam', key: string, active: boolean, dataSource?: Types.FilterParamDataSource | null, value: { __typename: 'FilterValueOption', options: Array<string> } | { __typename: 'FilterValueRange', min: number, max: number } }> } | null };


export const PlantingsDocument = gql`
    query Plantings($cropType: String!, $filterId: String!) {
  plantings(cropType: $cropType) {
    id
    values {
      name
      value
      plantingId
      modusId
    }
    producer {
      id
    }
  }
  filter(id: $filterId) @client {
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
  }
}
    `;

/**
 * __usePlantingsQuery__
 *
 * To run a query within a React component, call `usePlantingsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlantingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlantingsQuery({
 *   variables: {
 *      cropType: // value for 'cropType'
 *      filterId: // value for 'filterId'
 *   },
 * });
 */
export function usePlantingsQuery(baseOptions: Apollo.QueryHookOptions<PlantingsQuery, PlantingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlantingsQuery, PlantingsQueryVariables>(PlantingsDocument, options);
      }
export function usePlantingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlantingsQuery, PlantingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlantingsQuery, PlantingsQueryVariables>(PlantingsDocument, options);
        }
export type PlantingsQueryHookResult = ReturnType<typeof usePlantingsQuery>;
export type PlantingsLazyQueryHookResult = ReturnType<typeof usePlantingsLazyQuery>;
export type PlantingsQueryResult = Apollo.QueryResult<PlantingsQuery, PlantingsQueryVariables>;