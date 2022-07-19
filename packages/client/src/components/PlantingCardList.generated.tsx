import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PlantingCardListQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type PlantingCardListQuery = { __typename?: 'Query', selectedCropType: string, openEventCardIds: Array<string> };


export const PlantingCardListDocument = gql`
    query PlantingCardList($cropType: String! = "") {
  selectedCropType @client @export(as: "cropType")
  openEventCardIds(cropType: $cropType) @client
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
 *      cropType: // value for 'cropType'
 *   },
 * });
 */
export function usePlantingCardListQuery(baseOptions?: Apollo.QueryHookOptions<PlantingCardListQuery, PlantingCardListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlantingCardListQuery, PlantingCardListQueryVariables>(PlantingCardListDocument, options);
      }
export function usePlantingCardListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlantingCardListQuery, PlantingCardListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlantingCardListQuery, PlantingCardListQueryVariables>(PlantingCardListDocument, options);
        }
export type PlantingCardListQueryHookResult = ReturnType<typeof usePlantingCardListQuery>;
export type PlantingCardListLazyQueryHookResult = ReturnType<typeof usePlantingCardListLazyQuery>;
export type PlantingCardListQueryResult = Apollo.QueryResult<PlantingCardListQuery, PlantingCardListQueryVariables>;