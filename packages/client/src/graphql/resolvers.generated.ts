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
  animals_total?: Maybe<Scalars['Int']>;
  area_total_hectares?: Maybe<Scalars['Float']>;
  average_annual_rainfall?: Maybe<Scalars['Float']>;
  average_annual_temperature?: Maybe<Scalars['Float']>;
  certifications_current: Array<Scalars['String']>;
  certifications_current_detail: Array<Scalars['String']>;
  certifications_future: Array<Scalars['String']>;
  certifications_future_detail: Array<Scalars['String']>;
  climate_zone?: Maybe<Scalars['String']>;
  conditions_detail?: Maybe<Scalars['String']>;
  county?: Maybe<Scalars['String']>;
  equity_practices: Array<Scalars['String']>;
  farmDomain?: Maybe<Scalars['String']>;
  goals: Array<Scalars['String']>;
  hardiness_zone?: Maybe<Scalars['String']>;
  immediate_data_source?: Maybe<Scalars['String']>;
  interest: Array<Scalars['String']>;
  location_address_line1?: Maybe<Scalars['String']>;
  location_address_line2?: Maybe<Scalars['String']>;
  location_country_code?: Maybe<Scalars['String']>;
  location_locality?: Maybe<Scalars['String']>;
  location_postal_code?: Maybe<Scalars['String']>;
  management_plans_current?: Maybe<Scalars['String']>;
  management_plans_current_detail: Array<Scalars['String']>;
  motivations: Array<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  products_categories: Array<Scalars['String']>;
  records_system: Array<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  surveystack_id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  types: Array<Scalars['String']>;
  units?: Maybe<Scalars['String']>;
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
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
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
  Float: Scalars['Float'];
  Int: Scalars['Int'];
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
  animals_total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  area_total_hectares?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  average_annual_rainfall?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  average_annual_temperature?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  certifications_current?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  certifications_current_detail?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  certifications_future?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  certifications_future_detail?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  climate_zone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditions_detail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  county?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  equity_practices?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  farmDomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  goals?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  hardiness_zone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  immediate_data_source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interest?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  location_address_line1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location_address_line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location_country_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location_locality?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location_postal_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  management_plans_current?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  management_plans_current_detail?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  motivations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products_categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  records_system?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  surveystack_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  units?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  Planting?: PlantingResolvers<ContextType>;
  PlantingEvent?: PlantingEventResolvers<ContextType>;
  PlantingEventDetail?: PlantingEventDetailResolvers<ContextType>;
  PlantingParams?: PlantingParamsResolvers<ContextType>;
  PlantingValue?: PlantingValueResolvers<ContextType>;
  Producer?: ProducerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

