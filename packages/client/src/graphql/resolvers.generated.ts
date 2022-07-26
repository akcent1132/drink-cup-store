import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FarmOnboarding = {
  __typename?: 'FarmOnboarding';
  averageAnnualRainfall?: Maybe<Scalars['Float']>;
  averageAnnualTemperature?: Maybe<Scalars['Float']>;
  climateZone?: Maybe<Scalars['String']>;
  farmDomain?: Maybe<Scalars['String']>;
  values: Array<FarmOnboardingValue>;
};

export type FarmOnboardingValue = {
  __typename?: 'FarmOnboardingValue';
  key: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type Planting = {
  __typename?: 'Planting';
  cropType: Scalars['String'];
  events: Array<PlantingEvent>;
  farmOnboarding?: Maybe<FarmOnboarding>;
  id: Scalars['String'];
  params: PlantingParams;
  producer: Producer;
  title: Scalars['String'];
  values: Array<PlantingValue>;
};

export type PlantingEvent = {
  __typename?: 'PlantingEvent';
  _planting_id_for_details_request: Scalars['String'];
  _producer_key_for_details_request: Scalars['String'];
  date: Scalars['String'];
  details?: Maybe<Array<PlantingEventDetail>>;
  detailsKey?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type: Scalars['String'];
};

export type PlantingEventDetail = {
  __typename?: 'PlantingEventDetail';
  id: Scalars['String'];
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  valueList?: Maybe<Array<Scalars['String']>>;
};

export type PlantingParams = {
  __typename?: 'PlantingParams';
  precipitation: Scalars['String'];
  temperature: Scalars['String'];
  texture: Scalars['String'];
  zone: Scalars['String'];
};

export type PlantingValue = {
  __typename?: 'PlantingValue';
  modusId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  plantingId: Scalars['String'];
  value: Scalars['Float'];
};

export type Producer = {
  __typename?: 'Producer';
  code: Scalars['String'];
  id: Scalars['String'];
  plantings: Array<Planting>;
};

export type Query = {
  __typename?: 'Query';
  allFarmOnboardings: Array<FarmOnboarding>;
  allPlantings: Array<Planting>;
  planting?: Maybe<Planting>;
  plantings: Array<Planting>;
  producer?: Maybe<Producer>;
};


export type QueryPlantingArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};


export type QueryProducerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FarmOnboarding: ResolverTypeWrapper<FarmOnboarding>;
  FarmOnboardingValue: ResolverTypeWrapper<FarmOnboardingValue>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Planting: ResolverTypeWrapper<Planting>;
  PlantingEvent: ResolverTypeWrapper<PlantingEvent>;
  PlantingEventDetail: ResolverTypeWrapper<PlantingEventDetail>;
  PlantingParams: ResolverTypeWrapper<PlantingParams>;
  PlantingValue: ResolverTypeWrapper<PlantingValue>;
  Producer: ResolverTypeWrapper<Producer>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  FarmOnboarding: FarmOnboarding;
  FarmOnboardingValue: FarmOnboardingValue;
  Float: Scalars['Float'];
  Planting: Planting;
  PlantingEvent: PlantingEvent;
  PlantingEventDetail: PlantingEventDetail;
  PlantingParams: PlantingParams;
  PlantingValue: PlantingValue;
  Producer: Producer;
  Query: {};
  String: Scalars['String'];
}>;

export type FarmOnboardingResolvers<ContextType = any, ParentType extends ResolversParentTypes['FarmOnboarding'] = ResolversParentTypes['FarmOnboarding']> = ResolversObject<{
  averageAnnualRainfall?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  averageAnnualTemperature?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  climateZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  farmDomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['FarmOnboardingValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FarmOnboardingValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['FarmOnboardingValue'] = ResolversParentTypes['FarmOnboardingValue']> = ResolversObject<{
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Planting'] = ResolversParentTypes['Planting']> = ResolversObject<{
  cropType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['PlantingEvent']>, ParentType, ContextType>;
  farmOnboarding?: Resolver<Maybe<ResolversTypes['FarmOnboarding']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  params?: Resolver<ResolversTypes['PlantingParams'], ParentType, ContextType>;
  producer?: Resolver<ResolversTypes['Producer'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['PlantingValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingEvent'] = ResolversParentTypes['PlantingEvent']> = ResolversObject<{
  _planting_id_for_details_request?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  _producer_key_for_details_request?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  details?: Resolver<Maybe<Array<ResolversTypes['PlantingEventDetail']>>, ParentType, ContextType>;
  detailsKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingEventDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingEventDetail'] = ResolversParentTypes['PlantingEventDetail']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  valueList?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingParams'] = ResolversParentTypes['PlantingParams']> = ResolversObject<{
  precipitation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  temperature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  texture?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingValue'] = ResolversParentTypes['PlantingValue']> = ResolversObject<{
  modusId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plantingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProducerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Producer'] = ResolversParentTypes['Producer']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plantings?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allFarmOnboardings?: Resolver<Array<ResolversTypes['FarmOnboarding']>, ParentType, ContextType>;
  allPlantings?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType>;
  planting?: Resolver<Maybe<ResolversTypes['Planting']>, ParentType, ContextType, Partial<QueryPlantingArgs>>;
  plantings?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType, RequireFields<QueryPlantingsArgs, 'cropType'>>;
  producer?: Resolver<Maybe<ResolversTypes['Producer']>, ParentType, ContextType, Partial<QueryProducerArgs>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  FarmOnboarding?: FarmOnboardingResolvers<ContextType>;
  FarmOnboardingValue?: FarmOnboardingValueResolvers<ContextType>;
  Planting?: PlantingResolvers<ContextType>;
  PlantingEvent?: PlantingEventResolvers<ContextType>;
  PlantingEventDetail?: PlantingEventDetailResolvers<ContextType>;
  PlantingParams?: PlantingParamsResolvers<ContextType>;
  PlantingValue?: PlantingValueResolvers<ContextType>;
  Producer?: ProducerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

