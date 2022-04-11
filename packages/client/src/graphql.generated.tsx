import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Filter = {
  __typename?: 'Filter';
  activeParams?: Maybe<FilterParams>;
  color: Scalars['String'];
  colors: Array<Maybe<Scalars['String']>>;
  cropType: Scalars['String'];
  draftParams?: Maybe<FilterParams>;
  groups: Array<Maybe<Scalars['String']>>;
  id: Scalars['String'];
  name: Scalars['String'];
  plantings: Array<Maybe<Planting>>;
};

export type FilterParams = {
  __typename?: 'FilterParams';
  amendments: Array<Maybe<Scalars['String']>>;
  climateRegion: Array<Maybe<Scalars['String']>>;
  colors: Array<Maybe<Scalars['String']>>;
  farmPractices: Array<Maybe<Scalars['String']>>;
  flavorScore: Array<Maybe<Scalars['Int']>>;
  groups: Array<Maybe<Scalars['String']>>;
  landPreparation: Array<Maybe<Scalars['String']>>;
  sampleSource: Array<Maybe<Scalars['String']>>;
  sweetnessScore: Array<Maybe<Scalars['Int']>>;
  tasteScore: Array<Maybe<Scalars['Int']>>;
  years: Array<Maybe<Scalars['String']>>;
};

export type Planting = {
  __typename?: 'Planting';
  cropType: Scalars['String'];
  id: Scalars['String'];
  values: Array<Maybe<PlantingValue>>;
};

export type PlantingValue = {
  __typename?: 'PlantingValue';
  name: Scalars['String'];
  value: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  filters?: Maybe<Array<Maybe<Filter>>>;
  plantings?: Maybe<Array<Maybe<Planting>>>;
  selectedCropType: Scalars['String'];
  test: Scalars['Boolean'];
};


export type QueryFiltersArgs = {
  cropType: Scalars['String'];
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};

export type FilterKeySpecifier = ('activeParams' | 'color' | 'colors' | 'cropType' | 'draftParams' | 'groups' | 'id' | 'name' | 'plantings' | FilterKeySpecifier)[];
export type FilterFieldPolicy = {
	activeParams?: FieldPolicy<any> | FieldReadFunction<any>,
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	colors?: FieldPolicy<any> | FieldReadFunction<any>,
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	draftParams?: FieldPolicy<any> | FieldReadFunction<any>,
	groups?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FilterParamsKeySpecifier = ('amendments' | 'climateRegion' | 'colors' | 'farmPractices' | 'flavorScore' | 'groups' | 'landPreparation' | 'sampleSource' | 'sweetnessScore' | 'tasteScore' | 'years' | FilterParamsKeySpecifier)[];
export type FilterParamsFieldPolicy = {
	amendments?: FieldPolicy<any> | FieldReadFunction<any>,
	climateRegion?: FieldPolicy<any> | FieldReadFunction<any>,
	colors?: FieldPolicy<any> | FieldReadFunction<any>,
	farmPractices?: FieldPolicy<any> | FieldReadFunction<any>,
	flavorScore?: FieldPolicy<any> | FieldReadFunction<any>,
	groups?: FieldPolicy<any> | FieldReadFunction<any>,
	landPreparation?: FieldPolicy<any> | FieldReadFunction<any>,
	sampleSource?: FieldPolicy<any> | FieldReadFunction<any>,
	sweetnessScore?: FieldPolicy<any> | FieldReadFunction<any>,
	tasteScore?: FieldPolicy<any> | FieldReadFunction<any>,
	years?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingKeySpecifier = ('cropType' | 'id' | 'values' | PlantingKeySpecifier)[];
export type PlantingFieldPolicy = {
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingValueKeySpecifier = ('name' | 'value' | PlantingValueKeySpecifier)[];
export type PlantingValueFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('filters' | 'plantings' | 'selectedCropType' | 'test' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	filters?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedCropType?: FieldPolicy<any> | FieldReadFunction<any>,
	test?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Filter?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterKeySpecifier | (() => undefined | FilterKeySpecifier),
		fields?: FilterFieldPolicy,
	},
	FilterParams?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterParamsKeySpecifier | (() => undefined | FilterParamsKeySpecifier),
		fields?: FilterParamsFieldPolicy,
	},
	Planting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingKeySpecifier | (() => undefined | PlantingKeySpecifier),
		fields?: PlantingFieldPolicy,
	},
	PlantingValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingValueKeySpecifier | (() => undefined | PlantingValueKeySpecifier),
		fields?: PlantingValueFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;