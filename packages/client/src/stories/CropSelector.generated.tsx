import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CropSelectorQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CropSelectorQuery = { __typename?: 'Query', allPlantings: Array<{ __typename?: 'Planting', id: string, cropType: string }> };


export const CropSelectorDocument = gql`
    query CropSelector {
  allPlantings {
    id
    cropType
  }
}
    `;

/**
 * __useCropSelectorQuery__
 *
 * To run a query within a React component, call `useCropSelectorQuery` and pass it any options that fit your needs.
 * When your component renders, `useCropSelectorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCropSelectorQuery({
 *   variables: {
 *   },
 * });
 */
export function useCropSelectorQuery(baseOptions?: Apollo.QueryHookOptions<CropSelectorQuery, CropSelectorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CropSelectorQuery, CropSelectorQueryVariables>(CropSelectorDocument, options);
      }
export function useCropSelectorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CropSelectorQuery, CropSelectorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CropSelectorQuery, CropSelectorQueryVariables>(CropSelectorDocument, options);
        }
export type CropSelectorQueryHookResult = ReturnType<typeof useCropSelectorQuery>;
export type CropSelectorLazyQueryHookResult = ReturnType<typeof useCropSelectorLazyQuery>;
export type CropSelectorQueryResult = Apollo.QueryResult<CropSelectorQuery, CropSelectorQueryVariables>;