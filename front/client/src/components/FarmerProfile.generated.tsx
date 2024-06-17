import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FarmerProfileQueryVariables = Types.Exact<{
  producerId: Types.Scalars['String'];
}>;


export type FarmerProfileQuery = { __typename?: 'Query', producer?: { __typename?: 'Producer', id: string, code: string, plantings: Array<{ __typename?: 'Planting', id: string, title: string, producer: { __typename?: 'Producer', id: string, code: string }, events?: Array<{ __typename?: 'PlantingEvent', id: string, date: string, type: string, details?: Array<{ __typename?: 'PlantingEventDetail', id: string, name: string, value?: string | null, valueList?: Array<string> | null }> | null }> | null, params?: { __typename?: 'PlantingParams', clayPercentage?: number | null, sandPercentage?: number | null } | null, values: Array<{ __typename?: 'PlantingValue', name: string, value: number }>, farmOnboarding?: { __typename?: 'FarmOnboarding', id: string, climateZone?: string | null, averageAnnualTemperature?: number | null, averageAnnualRainfall?: number | null, values?: Array<{ __typename?: 'FarmOnboardingValue', key: string, values: Array<string> }> | null } | null }> } | null };


export const FarmerProfileDocument = gql`
    query FarmerProfile($producerId: String!) {
  producer(id: $producerId) {
    id
    code
    plantings {
      id
      producer {
        id
        code
      }
      events {
        id
        date
        type
        details {
          id
          name
          value
          valueList
        }
      }
      title
      params {
        clayPercentage
        sandPercentage
      }
      values {
        name
        value
      }
      farmOnboarding {
        id
        climateZone
        averageAnnualTemperature
        averageAnnualRainfall
        values {
          key
          values
        }
      }
    }
  }
}
    `;

/**
 * __useFarmerProfileQuery__
 *
 * To run a query within a React component, call `useFarmerProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFarmerProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFarmerProfileQuery({
 *   variables: {
 *      producerId: // value for 'producerId'
 *   },
 * });
 */
export function useFarmerProfileQuery(baseOptions: Apollo.QueryHookOptions<FarmerProfileQuery, FarmerProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FarmerProfileQuery, FarmerProfileQueryVariables>(FarmerProfileDocument, options);
      }
export function useFarmerProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FarmerProfileQuery, FarmerProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FarmerProfileQuery, FarmerProfileQueryVariables>(FarmerProfileDocument, options);
        }
export type FarmerProfileQueryHookResult = ReturnType<typeof useFarmerProfileQuery>;
export type FarmerProfileLazyQueryHookResult = ReturnType<typeof useFarmerProfileLazyQuery>;
export type FarmerProfileQueryResult = Apollo.QueryResult<FarmerProfileQuery, FarmerProfileQueryVariables>;