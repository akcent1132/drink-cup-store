import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EventsCardQueryVariables = Types.Exact<{
  plantingId: Types.Scalars['String'];
}>;


export type EventsCardQuery = { __typename?: 'Query', planting?: { __typename?: 'Planting', id: string, title: string, producer: { __typename?: 'Producer', id: string, code: string }, params: { __typename?: 'PlantingParams', precipitation: string, temperature: string, texture: string, zone: string }, events: Array<{ __typename?: 'PlantingEvent', id: string, date: string, type: string, detailsKey?: string | null, details?: Array<{ __typename?: 'PlantingEventDetail', id: string, name: string, value?: string | null, valueList?: Array<string> | null }> | null }> } | null };


export const EventsCardDocument = gql`
    query EventsCard($plantingId: String!) {
  planting(id: $plantingId) {
    id
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
    `;

/**
 * __useEventsCardQuery__
 *
 * To run a query within a React component, call `useEventsCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsCardQuery({
 *   variables: {
 *      plantingId: // value for 'plantingId'
 *   },
 * });
 */
export function useEventsCardQuery(baseOptions: Apollo.QueryHookOptions<EventsCardQuery, EventsCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsCardQuery, EventsCardQueryVariables>(EventsCardDocument, options);
      }
export function useEventsCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsCardQuery, EventsCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsCardQuery, EventsCardQueryVariables>(EventsCardDocument, options);
        }
export type EventsCardQueryHookResult = ReturnType<typeof useEventsCardQuery>;
export type EventsCardLazyQueryHookResult = ReturnType<typeof useEventsCardLazyQuery>;
export type EventsCardQueryResult = Apollo.QueryResult<EventsCardQuery, EventsCardQueryVariables>;