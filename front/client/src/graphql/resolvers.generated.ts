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

export type AuthUser = {
  __typename?: 'AuthUser';
  email: Scalars['String'];
  farms?: Maybe<Array<Maybe<Producer>>>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};

export type AvailableCropType = {
  __typename?: 'AvailableCropType';
  cropType: Scalars['String'];
  id: Scalars['String'];
  plantingCount: Scalars['Int'];
};

export type FarmOnboarding = {
  __typename?: 'FarmOnboarding';
  averageAnnualRainfall?: Maybe<Scalars['Float']>;
  averageAnnualTemperature?: Maybe<Scalars['Float']>;
  climateZone?: Maybe<Scalars['String']>;
  farmDomain?: Maybe<Scalars['String']>;
  hardinessZone?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  values?: Maybe<Array<FarmOnboardingValue>>;
};

export type FarmOnboardingValue = {
  __typename?: 'FarmOnboardingValue';
  key: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  user?: Maybe<AuthUser>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<LoginResponse>;
  requestMagicLoginLink?: Maybe<RequestMagicLoginLinkResponse>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRequestMagicLoginLinkArgs = {
  email: Scalars['String'];
};

export type Planting = {
  __typename?: 'Planting';
  cropType: Scalars['String'];
  events?: Maybe<Array<PlantingEvent>>;
  farmOnboarding?: Maybe<FarmOnboarding>;
  id: Scalars['String'];
  params?: Maybe<PlantingParams>;
  producer: Producer;
  title: Scalars['String'];
  values: Array<PlantingValue>;
};

export type PlantingEvent = {
  __typename?: 'PlantingEvent';
  date: Scalars['String'];
  details?: Maybe<Array<PlantingEventDetail>>;
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
  clayPercentage?: Maybe<Scalars['Int']>;
  sandPercentage?: Maybe<Scalars['Int']>;
  soilGroup?: Maybe<Scalars['String']>;
  soilOrder?: Maybe<Scalars['String']>;
  soilSuborder?: Maybe<Scalars['String']>;
  soilTexture?: Maybe<Scalars['Int']>;
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
  availableCropTypes: Array<AvailableCropType>;
  connectedFarmIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  myFarms?: Maybe<Array<Maybe<Producer>>>;
  planting?: Maybe<Planting>;
  plantings: Array<Planting>;
  plantingsById: Array<Planting>;
  producer?: Maybe<Producer>;
  producers?: Maybe<Array<Maybe<Producer>>>;
  rows?: Maybe<Array<Maybe<Row>>>;
  surveyStackGroups?: Maybe<Array<SurveyStackGroup>>;
};


export type QueryMyFarmsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryPlantingArgs = {
  id: Scalars['String'];
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};


export type QueryPlantingsByIdArgs = {
  ids: Array<Scalars['String']>;
};


export type QueryProducerArgs = {
  id: Scalars['String'];
};


export type QueryProducersArgs = {
  ids: Array<Scalars['String']>;
};


export type QuerySurveyStackGroupsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type RequestMagicLoginLinkResponse = {
  __typename?: 'RequestMagicLoginLinkResponse';
  error?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Row = {
  __typename?: 'Row';
  hierarchy: Array<Scalars['String']>;
  isAggregatable?: Maybe<Scalars['Boolean']>;
  modusTestId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
};

export type SurveyStackGroup = {
  __typename?: 'SurveyStackGroup';
  id: Scalars['String'];
  name: Scalars['String'];
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
  AuthUser: ResolverTypeWrapper<AuthUser>;
  AvailableCropType: ResolverTypeWrapper<AvailableCropType>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FarmOnboarding: ResolverTypeWrapper<FarmOnboarding>;
  FarmOnboardingValue: ResolverTypeWrapper<FarmOnboardingValue>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Planting: ResolverTypeWrapper<Planting>;
  PlantingEvent: ResolverTypeWrapper<PlantingEvent>;
  PlantingEventDetail: ResolverTypeWrapper<PlantingEventDetail>;
  PlantingParams: ResolverTypeWrapper<PlantingParams>;
  PlantingValue: ResolverTypeWrapper<PlantingValue>;
  Producer: ResolverTypeWrapper<Producer>;
  Query: ResolverTypeWrapper<{}>;
  RequestMagicLoginLinkResponse: ResolverTypeWrapper<RequestMagicLoginLinkResponse>;
  Row: ResolverTypeWrapper<Row>;
  String: ResolverTypeWrapper<Scalars['String']>;
  SurveyStackGroup: ResolverTypeWrapper<SurveyStackGroup>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthUser: AuthUser;
  AvailableCropType: AvailableCropType;
  Boolean: Scalars['Boolean'];
  FarmOnboarding: FarmOnboarding;
  FarmOnboardingValue: FarmOnboardingValue;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  LoginResponse: LoginResponse;
  Mutation: {};
  Planting: Planting;
  PlantingEvent: PlantingEvent;
  PlantingEventDetail: PlantingEventDetail;
  PlantingParams: PlantingParams;
  PlantingValue: PlantingValue;
  Producer: Producer;
  Query: {};
  RequestMagicLoginLinkResponse: RequestMagicLoginLinkResponse;
  Row: Row;
  String: Scalars['String'];
  SurveyStackGroup: SurveyStackGroup;
}>;

export type AuthUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUser'] = ResolversParentTypes['AuthUser']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  farms?: Resolver<Maybe<Array<Maybe<ResolversTypes['Producer']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AvailableCropTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AvailableCropType'] = ResolversParentTypes['AvailableCropType']> = ResolversObject<{
  cropType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plantingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FarmOnboardingResolvers<ContextType = any, ParentType extends ResolversParentTypes['FarmOnboarding'] = ResolversParentTypes['FarmOnboarding']> = ResolversObject<{
  averageAnnualRainfall?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  averageAnnualTemperature?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  climateZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  farmDomain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hardinessZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Maybe<Array<ResolversTypes['FarmOnboardingValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FarmOnboardingValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['FarmOnboardingValue'] = ResolversParentTypes['FarmOnboardingValue']> = ResolversObject<{
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['AuthUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  requestMagicLoginLink?: Resolver<Maybe<ResolversTypes['RequestMagicLoginLinkResponse']>, ParentType, ContextType, RequireFields<MutationRequestMagicLoginLinkArgs, 'email'>>;
}>;

export type PlantingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Planting'] = ResolversParentTypes['Planting']> = ResolversObject<{
  cropType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Maybe<Array<ResolversTypes['PlantingEvent']>>, ParentType, ContextType>;
  farmOnboarding?: Resolver<Maybe<ResolversTypes['FarmOnboarding']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['PlantingParams']>, ParentType, ContextType>;
  producer?: Resolver<ResolversTypes['Producer'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['PlantingValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingEvent'] = ResolversParentTypes['PlantingEvent']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  details?: Resolver<Maybe<Array<ResolversTypes['PlantingEventDetail']>>, ParentType, ContextType>;
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
  clayPercentage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sandPercentage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  soilGroup?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  soilOrder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  soilSuborder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  soilTexture?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  availableCropTypes?: Resolver<Array<ResolversTypes['AvailableCropType']>, ParentType, ContextType>;
  connectedFarmIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  myFarms?: Resolver<Maybe<Array<Maybe<ResolversTypes['Producer']>>>, ParentType, ContextType, Partial<QueryMyFarmsArgs>>;
  planting?: Resolver<Maybe<ResolversTypes['Planting']>, ParentType, ContextType, RequireFields<QueryPlantingArgs, 'id'>>;
  plantings?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType, RequireFields<QueryPlantingsArgs, 'cropType'>>;
  plantingsById?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType, RequireFields<QueryPlantingsByIdArgs, 'ids'>>;
  producer?: Resolver<Maybe<ResolversTypes['Producer']>, ParentType, ContextType, RequireFields<QueryProducerArgs, 'id'>>;
  producers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Producer']>>>, ParentType, ContextType, RequireFields<QueryProducersArgs, 'ids'>>;
  rows?: Resolver<Maybe<Array<Maybe<ResolversTypes['Row']>>>, ParentType, ContextType>;
  surveyStackGroups?: Resolver<Maybe<Array<ResolversTypes['SurveyStackGroup']>>, ParentType, ContextType, Partial<QuerySurveyStackGroupsArgs>>;
}>;

export type RequestMagicLoginLinkResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestMagicLoginLinkResponse'] = ResolversParentTypes['RequestMagicLoginLinkResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Row'] = ResolversParentTypes['Row']> = ResolversObject<{
  hierarchy?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  isAggregatable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  modusTestId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SurveyStackGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['SurveyStackGroup'] = ResolversParentTypes['SurveyStackGroup']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthUser?: AuthUserResolvers<ContextType>;
  AvailableCropType?: AvailableCropTypeResolvers<ContextType>;
  FarmOnboarding?: FarmOnboardingResolvers<ContextType>;
  FarmOnboardingValue?: FarmOnboardingValueResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Planting?: PlantingResolvers<ContextType>;
  PlantingEvent?: PlantingEventResolvers<ContextType>;
  PlantingEventDetail?: PlantingEventDetailResolvers<ContextType>;
  PlantingParams?: PlantingParamsResolvers<ContextType>;
  PlantingValue?: PlantingValueResolvers<ContextType>;
  Producer?: ProducerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RequestMagicLoginLinkResponse?: RequestMagicLoginLinkResponseResolvers<ContextType>;
  Row?: RowResolvers<ContextType>;
  SurveyStackGroup?: SurveyStackGroupResolvers<ContextType>;
}>;

