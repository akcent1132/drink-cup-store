import * as Types from '../graphql.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RandomContentQueryVariables = Types.Exact<{
  cropType?: Types.Scalars['String'];
}>;


export type RandomContentQuery = { __typename?: 'Query', selectedCropType: string };

export type PreloadDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PreloadDataQuery = { __typename?: 'Query', allFarmOnboardings: Array<{ __typename?: 'FarmOnboarding', farmDomain?: string | null, values: Array<{ __typename?: 'FarmOnboardingValue', key: string, values: Array<string> }> }>, allPlantings: Array<{ __typename?: 'Planting', id: string }> };


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
export const PreloadDataDocument = gql`
    query PreloadData {
  allFarmOnboardings {
    farmDomain
    values {
      key
      values
    }
  }
  allPlantings {
    id
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