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
  __typename: 'Filter';
  activeParams: Maybe<FilterParams>;
  color: Scalars['String'];
  cropType: Scalars['String'];
  draftParams: Maybe<FilterParams>;
  id: Scalars['String'];
  isHighlighted: Scalars['Boolean'];
  name: Scalars['String'];
  plantings: Array<Maybe<Planting>>;
};

export type FilterParams = {
  __typename: 'FilterParams';
  amendments: Array<Scalars['String']>;
  climateRegion: Array<Scalars['String']>;
  colors: Array<Scalars['String']>;
  farmPractices: Array<Scalars['String']>;
  flavorScore: Array<Scalars['Int']>;
  groups: Array<Scalars['String']>;
  landPreparation: Array<Scalars['String']>;
  sampleSource: Array<Scalars['String']>;
  sweetnessScore: Array<Scalars['Int']>;
  tasteScore: Array<Scalars['Int']>;
  years: Array<Scalars['Int']>;
};

export type GroupedValues = {
  __typename: 'GroupedValues';
  filter: Maybe<Filter>;
  id: Scalars['String'];
  values: Array<PlantingValue>;
};

export type Planting = {
  __typename: 'Planting';
  cropType: Scalars['String'];
  events: Array<PlantingEvent>;
  id: Scalars['String'];
  isHighlighted: Scalars['Boolean'];
  matchingFilters: Array<Filter>;
  params: PlantingParams;
  producer: Producer;
  title: Scalars['String'];
  values: Array<PlantingValue>;
};

export type PlantingEvent = {
  __typename: 'PlantingEvent';
  date: Scalars['String'];
  id: Scalars['String'];
  type: Scalars['String'];
};

export type PlantingParams = {
  __typename: 'PlantingParams';
  precipitation: Scalars['String'];
  temperature: Scalars['String'];
  texture: Scalars['String'];
  zone: Scalars['String'];
};

export type PlantingValue = {
  __typename: 'PlantingValue';
  name: Scalars['String'];
  plantingId: Scalars['String'];
  value: Scalars['Float'];
};

export type Producer = {
  __typename: 'Producer';
  code: Scalars['String'];
  id: Scalars['String'];
};

export type Query = {
  __typename: 'Query';
  filter: Maybe<Filter>;
  filters: Array<Filter>;
  groupedValues: Array<GroupedValues>;
  highlightedFilter: Maybe<Filter>;
  highlightedPlanting: Maybe<Planting>;
  openEventCards: Array<Planting>;
  planting: Maybe<Planting>;
  plantings: Array<Planting>;
  selectedCropType: Scalars['String'];
  selectedFilter: Maybe<Filter>;
  selectedProducer: Maybe<Producer>;
  test: Scalars['Boolean'];
};


export type QueryFilterArgs = {
  id: Scalars['String'];
};


export type QueryFiltersArgs = {
  cropType: Scalars['String'];
};


export type QueryGroupedValuesArgs = {
  cropType: Scalars['String'];
};


export type QueryOpenEventCardsArgs = {
  cropType: Scalars['String'];
};


export type QueryPlantingArgs = {
  id: Scalars['String'];
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};

export type FilterKeySpecifier = ('activeParams' | 'color' | 'cropType' | 'draftParams' | 'id' | 'isHighlighted' | 'name' | 'plantings' | FilterKeySpecifier)[];
export type FilterFieldPolicy = {
	activeParams?: FieldPolicy<any> | FieldReadFunction<any>,
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	draftParams?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isHighlighted?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type GroupedValuesKeySpecifier = ('filter' | 'id' | 'values' | GroupedValuesKeySpecifier)[];
export type GroupedValuesFieldPolicy = {
	filter?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingKeySpecifier = ('cropType' | 'events' | 'id' | 'isHighlighted' | 'matchingFilters' | 'params' | 'producer' | 'title' | 'values' | PlantingKeySpecifier)[];
export type PlantingFieldPolicy = {
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isHighlighted?: FieldPolicy<any> | FieldReadFunction<any>,
	matchingFilters?: FieldPolicy<any> | FieldReadFunction<any>,
	params?: FieldPolicy<any> | FieldReadFunction<any>,
	producer?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingEventKeySpecifier = ('date' | 'id' | 'type' | PlantingEventKeySpecifier)[];
export type PlantingEventFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingParamsKeySpecifier = ('precipitation' | 'temperature' | 'texture' | 'zone' | PlantingParamsKeySpecifier)[];
export type PlantingParamsFieldPolicy = {
	precipitation?: FieldPolicy<any> | FieldReadFunction<any>,
	temperature?: FieldPolicy<any> | FieldReadFunction<any>,
	texture?: FieldPolicy<any> | FieldReadFunction<any>,
	zone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingValueKeySpecifier = ('name' | 'plantingId' | 'value' | PlantingValueKeySpecifier)[];
export type PlantingValueFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plantingId?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProducerKeySpecifier = ('code' | 'id' | ProducerKeySpecifier)[];
export type ProducerFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('filter' | 'filters' | 'groupedValues' | 'highlightedFilter' | 'highlightedPlanting' | 'openEventCards' | 'planting' | 'plantings' | 'selectedCropType' | 'selectedFilter' | 'selectedProducer' | 'test' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	filter?: FieldPolicy<any> | FieldReadFunction<any>,
	filters?: FieldPolicy<any> | FieldReadFunction<any>,
	groupedValues?: FieldPolicy<any> | FieldReadFunction<any>,
	highlightedFilter?: FieldPolicy<any> | FieldReadFunction<any>,
	highlightedPlanting?: FieldPolicy<any> | FieldReadFunction<any>,
	openEventCards?: FieldPolicy<any> | FieldReadFunction<any>,
	planting?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedCropType?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedFilter?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedProducer?: FieldPolicy<any> | FieldReadFunction<any>,
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
	GroupedValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupedValuesKeySpecifier | (() => undefined | GroupedValuesKeySpecifier),
		fields?: GroupedValuesFieldPolicy,
	},
	Planting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingKeySpecifier | (() => undefined | PlantingKeySpecifier),
		fields?: PlantingFieldPolicy,
	},
	PlantingEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingEventKeySpecifier | (() => undefined | PlantingEventKeySpecifier),
		fields?: PlantingEventFieldPolicy,
	},
	PlantingParams?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingParamsKeySpecifier | (() => undefined | PlantingParamsKeySpecifier),
		fields?: PlantingParamsFieldPolicy,
	},
	PlantingValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingValueKeySpecifier | (() => undefined | PlantingValueKeySpecifier),
		fields?: PlantingValueFieldPolicy,
	},
	Producer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProducerKeySpecifier | (() => undefined | ProducerKeySpecifier),
		fields?: ProducerFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;