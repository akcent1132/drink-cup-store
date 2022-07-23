import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RandomContentQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type RandomContentQuery = { __typename?: 'Query', selectedCropType: string };

export type DashboardQueryVariables = Types.Exact<{
  producerId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type DashboardQuery = { __typename?: 'Query', selectedFilterId?: string | null, selectedProducerId?: string | null, selectedProducer?: { __typename?: 'Producer', id: string, code: string, plantings: Array<{ __typename?: 'Planting', id: string, isHighlighted: boolean, title: string, producer: { __typename?: 'Producer', id: string, code: string }, params: { __typename?: 'PlantingParams', precipitation: string, temperature: string, texture: string, zone: string }, events: Array<{ __typename?: 'PlantingEvent', id: string, date: string, type: string, detailsKey?: string | null, details?: Array<{ __typename?: 'PlantingEventDetail', id: string, name: string, value?: string | null, valueList?: Array<string> | null }> | null }> }> } | null, allPlantings: Array<{ __typename?: 'Planting', id: string }> };

export type PreloadDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PreloadDataQuery = { __typename?: 'Query', allFarmOnboardings: Array<{ __typename?: 'FarmOnboarding', farmDomain?: string | null, values: Array<{ __typename?: 'FarmOnboardingValue', key: string, values: Array<string> }> }> };


export const RandomContentDocument = gql`
    query RandomContent($cropType: String! = "") {
  selectedCropType @client @export(as: "cropType")
}
    `;

/**
 * __useRandomContentQuery__
 *
 * To run a query within a React component, call `useRandomContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useRandomContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRandomContentQuery({
 *   variables: {
 *      cropType: // value for 'cropType'
 *   },
 * });
 */
export function useRandomContentQuery(baseOptions?: Apollo.QueryHookOptions<RandomContentQuery, RandomContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RandomContentQuery, RandomContentQueryVariables>(RandomContentDocument, options);
      }
export function useRandomContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RandomContentQuery, RandomContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RandomContentQuery, RandomContentQueryVariables>(RandomContentDocument, options);
        }
export type RandomContentQueryHookResult = ReturnType<typeof useRandomContentQuery>;
export type RandomContentLazyQueryHookResult = ReturnType<typeof useRandomContentLazyQuery>;
export type RandomContentQueryResult = Apollo.QueryResult<RandomContentQuery, RandomContentQueryVariables>;
export const DashboardDocument = gql`
    query Dashboard($producerId: String) {
  selectedFilterId @client
  selectedProducerId @client @export(as: "producerId")
  selectedProducer: producer(id: $producerId) {
    id
    code
    plantings {
      id
      isHighlighted @client
      producer {
        id
        code
      }
      title
      params {
        precipitation
        temperature
        texture
        zone
      }
      events {
        id
        date
        type
        detailsKey
        details {
          id
          name
          value
          valueList
        }
      }
    }
  }
  allPlantings {
    id
  }
}
    `;

/**
 * __useDashboardQuery__
 *
 * To run a query within a React component, call `useDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardQuery({
 *   variables: {
 *      producerId: // value for 'producerId'
 *   },
 * });
 */
export function useDashboardQuery(baseOptions?: Apollo.QueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
      }
export function useDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DashboardQuery, DashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DashboardQuery, DashboardQueryVariables>(DashboardDocument, options);
        }
export type DashboardQueryHookResult = ReturnType<typeof useDashboardQuery>;
export type DashboardLazyQueryHookResult = ReturnType<typeof useDashboardLazyQuery>;
export type DashboardQueryResult = Apollo.QueryResult<DashboardQuery, DashboardQueryVariables>;
export const PreloadDataDocument = gql`
    query PreloadData {
  allFarmOnboardings {
    farmDomain
    values {
      key
      values
    }
  }
}
    `;

/**
 * __usePreloadDataQuery__
 *
 * To run a query within a React component, call `usePreloadDataQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreloadDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreloadDataQuery({
 *   variables: {
 *   },
 * });
 */
export function usePreloadDataQuery(baseOptions?: Apollo.QueryHookOptions<PreloadDataQuery, PreloadDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreloadDataQuery, PreloadDataQueryVariables>(PreloadDataDocument, options);
      }
export function usePreloadDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreloadDataQuery, PreloadDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreloadDataQuery, PreloadDataQueryVariables>(PreloadDataDocument, options);
        }
export type PreloadDataQueryHookResult = ReturnType<typeof usePreloadDataQuery>;
export type PreloadDataLazyQueryHookResult = ReturnType<typeof usePreloadDataLazyQuery>;
export type PreloadDataQueryResult = Apollo.QueryResult<PreloadDataQuery, PreloadDataQueryVariables>;