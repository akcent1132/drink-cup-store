import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ValueDistributionQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type ValueDistributionQuery = { __typename?: 'Query', selectedCropType: string, plantings: Array<{ __typename?: 'Planting', id: string, values: Array<{ __typename?: 'PlantingValue', name: string, value: number, plantingId: string }>, matchingFilters: Array<{ __typename?: 'Filter', id: string, color: string }> }>, highlightedPlanting?: { __typename?: 'Planting', id: string } | null };


export const ValueDistributionDocument = gql`
    query ValueDistribution($cropType: String! = "") {
  selectedCropType @client @export(as: "cropType")
  plantings(cropType: $cropType) {
    id
    values {
      name
      value
      plantingId
    }
    matchingFilters {
      id
      color
    }
  }
  highlightedPlanting {
    id
  }
}
    `;

/**
 * __useValueDistributionQuery__
 *
 * To run a query within a React component, call `useValueDistributionQuery` and pass it any options that fit your needs.
 * When your component renders, `useValueDistributionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValueDistributionQuery({
 *   variables: {
 *      cropType: // value for 'cropType'
 *   },
 * });
 */
export function useValueDistributionQuery(baseOptions?: Apollo.QueryHookOptions<ValueDistributionQuery, ValueDistributionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValueDistributionQuery, ValueDistributionQueryVariables>(ValueDistributionDocument, options);
      }
export function useValueDistributionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValueDistributionQuery, ValueDistributionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValueDistributionQuery, ValueDistributionQueryVariables>(ValueDistributionDocument, options);
        }
export type ValueDistributionQueryHookResult = ReturnType<typeof useValueDistributionQuery>;
export type ValueDistributionLazyQueryHookResult = ReturnType<typeof useValueDistributionLazyQuery>;
export type ValueDistributionQueryResult = Apollo.QueryResult<ValueDistributionQuery, ValueDistributionQueryVariables>;