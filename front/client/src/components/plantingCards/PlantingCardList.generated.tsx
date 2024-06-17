import * as Types from "../../graphql.generated";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type PlantingCardListQueryVariables = Types.Exact<{
  plantingIds: Array<Types.Scalars["String"]> | Types.Scalars["String"];
}>;

export type PlantingCardListQuery = {
  __typename?: "Query";
  plantings: Array<{
    __typename?: "Planting";
    id: string;
    title: string;
    producer: { __typename?: "Producer"; id: string; code: string };
    events?: Array<{
      __typename?: "PlantingEvent";
      id: string;
      date: string;
      type: string;
      details?: Array<{
        __typename?: "PlantingEventDetail";
        id: string;
        name: string;
        value?: string | null;
        valueList?: Array<string> | null;
      }> | null;
    }> | null;
    params?: {
      __typename?: "PlantingParams";
      clayPercentage?: number | null;
      sandPercentage?: number | null;
    } | null;
    values: Array<{
      __typename?: "PlantingValue";
      name: string;
      value: number;
    }>;
    farmOnboarding?: {
      __typename?: "FarmOnboarding";
      id: string;
      climateZone?: string | null;
      hardinessZone?: string | null;
      averageAnnualTemperature?: number | null;
      averageAnnualRainfall?: number | null;
      values?: Array<{
        __typename?: "FarmOnboardingValue";
        key: string;
        values: Array<string>;
      }> | null;
    } | null;
  }>;
};

export const PlantingCardListDocument = gql`
  query PlantingCardList($plantingIds: [String!]!) {
    plantings: plantingsById(ids: $plantingIds) {
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
        hardinessZone
        averageAnnualTemperature
        averageAnnualRainfall
        values {
          key
          values
        }
      }
    }
  }
`;

/**
 * __usePlantingCardListQuery__
 *
 * To run a query within a React component, call `usePlantingCardListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlantingCardListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlantingCardListQuery({
 *   variables: {
 *      plantingIds: // value for 'plantingIds'
 *   },
 * });
 */
export function usePlantingCardListQuery(
  baseOptions: Apollo.QueryHookOptions<
    PlantingCardListQuery,
    PlantingCardListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PlantingCardListQuery, PlantingCardListQueryVariables>(
    PlantingCardListDocument,
    options
  );
}
export function usePlantingCardListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PlantingCardListQuery,
    PlantingCardListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PlantingCardListQuery,
    PlantingCardListQueryVariables
  >(PlantingCardListDocument, options);
}
export type PlantingCardListQueryHookResult = ReturnType<
  typeof usePlantingCardListQuery
>;
export type PlantingCardListLazyQueryHookResult = ReturnType<
  typeof usePlantingCardListLazyQuery
>;
export type PlantingCardListQueryResult = Apollo.QueryResult<
  PlantingCardListQuery,
  PlantingCardListQueryVariables
>;
