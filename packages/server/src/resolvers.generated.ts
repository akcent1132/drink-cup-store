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

export type Attributes = {
  __typename?: 'Attributes';
  changed?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  default_langcode?: Maybe<Scalars['Boolean']>;
  drupal_internal__id?: Maybe<Scalars['Int']>;
  drupal_internal__revision_id?: Maybe<Scalars['Int']>;
  flag?: Maybe<Array<Maybe<Scalars['String']>>>;
  geometry?: Maybe<Geometry>;
  is_movement?: Maybe<Scalars['Boolean']>;
  langcode?: Maybe<Scalars['String']>;
  lot_number?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  quick?: Maybe<Array<Maybe<Scalars['String']>>>;
  revision_created?: Maybe<Scalars['String']>;
  revision_log_message?: Maybe<Scalars['String']>;
  revision_translation_affected?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['String']>;
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  data?: Maybe<Array<Maybe<Scalars['String']>>>;
  links?: Maybe<Links>;
};

export type Crop = {
  __typename?: 'Crop';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  resource?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

export type Farm = {
  __typename?: 'Farm';
  harvestLogs?: Maybe<Array<Maybe<HarvestLog>>>;
};

export type FarmAsset = {
  __typename?: 'FarmAsset';
  archived?: Maybe<Scalars['String']>;
  changed?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  crop?: Maybe<Array<Maybe<Crop>>>;
  data?: Maybe<Scalars['String']>;
  description?: Maybe<Array<Maybe<Scalars['String']>>>;
  files?: Maybe<Array<Maybe<Scalars['String']>>>;
  flags?: Maybe<Array<Maybe<Scalars['String']>>>;
  geometry?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  location?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Array<Maybe<Scalars['String']>>>;
  season?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
  uid?: Maybe<Uid>;
  url?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  data?: Maybe<Array<Maybe<Scalars['String']>>>;
  links?: Maybe<Links>;
};

export type Geometry = {
  __typename?: 'Geometry';
  bottom?: Maybe<Scalars['Float']>;
  geo_type?: Maybe<Scalars['String']>;
  geohash?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  latlon?: Maybe<Scalars['String']>;
  left?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  right?: Maybe<Scalars['Float']>;
  top?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['String']>;
};

export type HarvestLog = {
  __typename?: 'HarvestLog';
  attributes?: Maybe<Attributes>;
  id?: Maybe<Scalars['String']>;
  links?: Maybe<Links>;
  relationships?: Maybe<Relationships>;
  type?: Maybe<Scalars['String']>;
};

export type Image = {
  __typename?: 'Image';
  data?: Maybe<Array<Maybe<Scalars['String']>>>;
  links?: Maybe<Links>;
};

export type Links = {
  __typename?: 'Links';
  related?: Maybe<Related>;
  self?: Maybe<Self>;
};

export type Planting = {
  __typename?: 'Planting';
  cropType: Scalars['String'];
  events: Array<PlantingEvent>;
  id: Scalars['String'];
  params: PlantingParams;
  producer: Producer;
  title: Scalars['String'];
  values: Array<PlantingValue>;
};

export type PlantingEvent = {
  __typename?: 'PlantingEvent';
  date: Scalars['String'];
  id: Scalars['String'];
  type: Scalars['String'];
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
  name: Scalars['String'];
  plantingId: Scalars['String'];
  value: Scalars['Float'];
};

export type Producer = {
  __typename?: 'Producer';
  code: Scalars['String'];
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  books?: Maybe<Array<Maybe<Book>>>;
  /** Test getting some data from FarmOS */
  farm?: Maybe<Farm>;
  /** Test getting some data from FarmOS aggregator */
  farmAssets?: Maybe<Array<Maybe<FarmAsset>>>;
  plantings: Array<Planting>;
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};

export type Related = {
  __typename?: 'Related';
  href?: Maybe<Scalars['String']>;
};

export type Relationships = {
  __typename?: 'Relationships';
  category?: Maybe<Category>;
  file?: Maybe<File>;
  image?: Maybe<Image>;
};

export type Self = {
  __typename?: 'Self';
  href?: Maybe<Scalars['String']>;
};

export type Uid = {
  __typename?: 'Uid';
  id?: Maybe<Scalars['String']>;
  resource?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
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
  Attributes: ResolverTypeWrapper<Attributes>;
  Book: ResolverTypeWrapper<Book>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<Category>;
  Crop: ResolverTypeWrapper<Crop>;
  Farm: ResolverTypeWrapper<Farm>;
  FarmAsset: ResolverTypeWrapper<FarmAsset>;
  File: ResolverTypeWrapper<File>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Geometry: ResolverTypeWrapper<Geometry>;
  HarvestLog: ResolverTypeWrapper<HarvestLog>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Links: ResolverTypeWrapper<Links>;
  Planting: ResolverTypeWrapper<Planting>;
  PlantingEvent: ResolverTypeWrapper<PlantingEvent>;
  PlantingParams: ResolverTypeWrapper<PlantingParams>;
  PlantingValue: ResolverTypeWrapper<PlantingValue>;
  Producer: ResolverTypeWrapper<Producer>;
  Query: ResolverTypeWrapper<{}>;
  Related: ResolverTypeWrapper<Related>;
  Relationships: ResolverTypeWrapper<Relationships>;
  Self: ResolverTypeWrapper<Self>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Uid: ResolverTypeWrapper<Uid>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Attributes: Attributes;
  Book: Book;
  Boolean: Scalars['Boolean'];
  Category: Category;
  Crop: Crop;
  Farm: Farm;
  FarmAsset: FarmAsset;
  File: File;
  Float: Scalars['Float'];
  Geometry: Geometry;
  HarvestLog: HarvestLog;
  Image: Image;
  Int: Scalars['Int'];
  Links: Links;
  Planting: Planting;
  PlantingEvent: PlantingEvent;
  PlantingParams: PlantingParams;
  PlantingValue: PlantingValue;
  Producer: Producer;
  Query: {};
  Related: Related;
  Relationships: Relationships;
  Self: Self;
  String: Scalars['String'];
  Uid: Uid;
}>;

export type AttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attributes'] = ResolversParentTypes['Attributes']> = ResolversObject<{
  changed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  default_langcode?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  drupal_internal__id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  drupal_internal__revision_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  flag?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  geometry?: Resolver<Maybe<ResolversTypes['Geometry']>, ParentType, ContextType>;
  is_movement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  langcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lot_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quick?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  revision_created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revision_log_message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  revision_translation_affected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  links?: Resolver<Maybe<ResolversTypes['Links']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CropResolvers<ContextType = any, ParentType extends ResolversParentTypes['Crop'] = ResolversParentTypes['Crop']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FarmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Farm'] = ResolversParentTypes['Farm']> = ResolversObject<{
  harvestLogs?: Resolver<Maybe<Array<Maybe<ResolversTypes['HarvestLog']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FarmAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['FarmAsset'] = ResolversParentTypes['FarmAsset']> = ResolversObject<{
  archived?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  changed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  crop?: Resolver<Maybe<Array<Maybe<ResolversTypes['Crop']>>>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  files?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  flags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  geometry?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  location?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  season?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uid?: Resolver<Maybe<ResolversTypes['Uid']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  links?: Resolver<Maybe<ResolversTypes['Links']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeometryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Geometry'] = ResolversParentTypes['Geometry']> = ResolversObject<{
  bottom?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  geo_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  geohash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  latlon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  left?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lon?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  right?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  top?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HarvestLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['HarvestLog'] = ResolversParentTypes['HarvestLog']> = ResolversObject<{
  attributes?: Resolver<Maybe<ResolversTypes['Attributes']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  links?: Resolver<Maybe<ResolversTypes['Links']>, ParentType, ContextType>;
  relationships?: Resolver<Maybe<ResolversTypes['Relationships']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  links?: Resolver<Maybe<ResolversTypes['Links']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LinksResolvers<ContextType = any, ParentType extends ResolversParentTypes['Links'] = ResolversParentTypes['Links']> = ResolversObject<{
  related?: Resolver<Maybe<ResolversTypes['Related']>, ParentType, ContextType>;
  self?: Resolver<Maybe<ResolversTypes['Self']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Planting'] = ResolversParentTypes['Planting']> = ResolversObject<{
  cropType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['PlantingEvent']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  params?: Resolver<ResolversTypes['PlantingParams'], ParentType, ContextType>;
  producer?: Resolver<ResolversTypes['Producer'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['PlantingValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlantingEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlantingEvent'] = ResolversParentTypes['PlantingEvent']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plantingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProducerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Producer'] = ResolversParentTypes['Producer']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Book']>>>, ParentType, ContextType>;
  farm?: Resolver<Maybe<ResolversTypes['Farm']>, ParentType, ContextType>;
  farmAssets?: Resolver<Maybe<Array<Maybe<ResolversTypes['FarmAsset']>>>, ParentType, ContextType>;
  plantings?: Resolver<Array<ResolversTypes['Planting']>, ParentType, ContextType, RequireFields<QueryPlantingsArgs, 'cropType'>>;
}>;

export type RelatedResolvers<ContextType = any, ParentType extends ResolversParentTypes['Related'] = ResolversParentTypes['Related']> = ResolversObject<{
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RelationshipsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Relationships'] = ResolversParentTypes['Relationships']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes['File']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SelfResolvers<ContextType = any, ParentType extends ResolversParentTypes['Self'] = ResolversParentTypes['Self']> = ResolversObject<{
  href?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UidResolvers<ContextType = any, ParentType extends ResolversParentTypes['Uid'] = ResolversParentTypes['Uid']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Attributes?: AttributesResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Crop?: CropResolvers<ContextType>;
  Farm?: FarmResolvers<ContextType>;
  FarmAsset?: FarmAssetResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  Geometry?: GeometryResolvers<ContextType>;
  HarvestLog?: HarvestLogResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Links?: LinksResolvers<ContextType>;
  Planting?: PlantingResolvers<ContextType>;
  PlantingEvent?: PlantingEventResolvers<ContextType>;
  PlantingParams?: PlantingParamsResolvers<ContextType>;
  PlantingValue?: PlantingValueResolvers<ContextType>;
  Producer?: ProducerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Related?: RelatedResolvers<ContextType>;
  Relationships?: RelationshipsResolvers<ContextType>;
  Self?: SelfResolvers<ContextType>;
  Uid?: UidResolvers<ContextType>;
}>;

