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

export type AuthState = {
  __typename: 'AuthState';
  isLoggedIn: Scalars['Boolean'];
  user: Maybe<AuthUser>;
};

export type AuthUser = {
  __typename: 'AuthUser';
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type FarmOnboarding = {
  __typename: 'FarmOnboarding';
  farmDomain: Maybe<Scalars['String']>;
  values: Array<FarmOnboardingValue>;
};

export type FarmOnboardingValue = {
  __typename: 'FarmOnboardingValue';
  key: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type Filter = {
  __typename: 'Filter';
  color: Scalars['String'];
  cropType: Scalars['String'];
  id: Scalars['String'];
  isHighlighted: Scalars['Boolean'];
  name: Scalars['String'];
  params: Array<FilterParam>;
  plantings: Array<Planting>;
};

export type FilterParam = {
  __typename: 'FilterParam';
  active: Scalars['Boolean'];
  dataSource: Maybe<FilterParamDataSource>;
  key: Scalars['String'];
  value: FilterValue;
};

export enum FilterParamDataSource {
  FarmOnboarding = 'FARM_ONBOARDING',
  Values = 'VALUES'
}

export type FilterValue = FilterValueOption | FilterValueRange;

export type FilterValueOption = {
  __typename: 'FilterValueOption';
  options: Array<Scalars['String']>;
};

export type FilterValueRange = {
  __typename: 'FilterValueRange';
  max: Scalars['Float'];
  min: Scalars['Float'];
};

export type Planting = {
  __typename: 'Planting';
  cropType: Scalars['String'];
  events: Array<PlantingEvent>;
  farmOnboarding: Maybe<FarmOnboarding>;
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
  details: Maybe<Array<PlantingEventDetail>>;
  detailsKey: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type: Scalars['String'];
};

export type PlantingEventDetail = {
  __typename: 'PlantingEventDetail';
  id: Scalars['String'];
  name: Scalars['String'];
  value: Maybe<Scalars['String']>;
  valueList: Maybe<Array<Scalars['String']>>;
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
  modusId: Maybe<Scalars['String']>;
  name: Scalars['String'];
  plantingId: Scalars['String'];
  value: Scalars['Float'];
};

export type Producer = {
  __typename: 'Producer';
  code: Scalars['String'];
  id: Scalars['String'];
  plantings: Array<Planting>;
};

export type Query = {
  __typename: 'Query';
  allFarmOnboardings: Array<FarmOnboarding>;
  allPlantings: Array<Planting>;
  auth: Maybe<AuthState>;
  filter: Maybe<Filter>;
  filters: Array<Filter>;
  highlightedFilterId: Maybe<Scalars['String']>;
  highlightedPlantingId: Maybe<Scalars['String']>;
  notgood: Maybe<Scalars['String']>;
  openEventCardIds: Array<Scalars['String']>;
  planting: Maybe<Planting>;
  plantings: Array<Planting>;
  producer: Maybe<Producer>;
  selectedCropType: Scalars['String'];
  selectedFilterId: Maybe<Scalars['String']>;
  selectedProducerId: Maybe<Scalars['String']>;
  test: Scalars['Boolean'];
};


export type QueryFilterArgs = {
  id: Scalars['String'];
};


export type QueryFiltersArgs = {
  cropType: Scalars['String'];
};


export type QueryOpenEventCardIdsArgs = {
  cropType: Scalars['String'];
};


export type QueryPlantingArgs = {
  id: Scalars['String'];
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};


export type QueryProducerArgs = {
  id: InputMaybe<Scalars['String']>;
};

export type AuthStateKeySpecifier = ('isLoggedIn' | 'user' | AuthStateKeySpecifier)[];
export type AuthStateFieldPolicy = {
	isLoggedIn?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AuthUserKeySpecifier = ('email' | 'id' | 'name' | AuthUserKeySpecifier)[];
export type AuthUserFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FarmOnboardingKeySpecifier = ('farmDomain' | 'values' | FarmOnboardingKeySpecifier)[];
export type FarmOnboardingFieldPolicy = {
	farmDomain?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FarmOnboardingValueKeySpecifier = ('key' | 'values' | FarmOnboardingValueKeySpecifier)[];
export type FarmOnboardingValueFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FilterKeySpecifier = ('color' | 'cropType' | 'id' | 'isHighlighted' | 'name' | 'params' | 'plantings' | FilterKeySpecifier)[];
export type FilterFieldPolicy = {
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isHighlighted?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	params?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FilterParamKeySpecifier = ('active' | 'dataSource' | 'key' | 'value' | FilterParamKeySpecifier)[];
export type FilterParamFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	dataSource?: FieldPolicy<any> | FieldReadFunction<any>,
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FilterValueOptionKeySpecifier = ('options' | FilterValueOptionKeySpecifier)[];
export type FilterValueOptionFieldPolicy = {
	options?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FilterValueRangeKeySpecifier = ('max' | 'min' | FilterValueRangeKeySpecifier)[];
export type FilterValueRangeFieldPolicy = {
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingKeySpecifier = ('cropType' | 'events' | 'farmOnboarding' | 'id' | 'isHighlighted' | 'matchingFilters' | 'params' | 'producer' | 'title' | 'values' | PlantingKeySpecifier)[];
export type PlantingFieldPolicy = {
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	farmOnboarding?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isHighlighted?: FieldPolicy<any> | FieldReadFunction<any>,
	matchingFilters?: FieldPolicy<any> | FieldReadFunction<any>,
	params?: FieldPolicy<any> | FieldReadFunction<any>,
	producer?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingEventKeySpecifier = ('date' | 'details' | 'detailsKey' | 'id' | 'type' | PlantingEventKeySpecifier)[];
export type PlantingEventFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	details?: FieldPolicy<any> | FieldReadFunction<any>,
	detailsKey?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingEventDetailKeySpecifier = ('id' | 'name' | 'value' | 'valueList' | PlantingEventDetailKeySpecifier)[];
export type PlantingEventDetailFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueList?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingParamsKeySpecifier = ('precipitation' | 'temperature' | 'texture' | 'zone' | PlantingParamsKeySpecifier)[];
export type PlantingParamsFieldPolicy = {
	precipitation?: FieldPolicy<any> | FieldReadFunction<any>,
	temperature?: FieldPolicy<any> | FieldReadFunction<any>,
	texture?: FieldPolicy<any> | FieldReadFunction<any>,
	zone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingValueKeySpecifier = ('modusId' | 'name' | 'plantingId' | 'value' | PlantingValueKeySpecifier)[];
export type PlantingValueFieldPolicy = {
	modusId?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	plantingId?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProducerKeySpecifier = ('code' | 'id' | 'plantings' | ProducerKeySpecifier)[];
export type ProducerFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('allFarmOnboardings' | 'allPlantings' | 'auth' | 'filter' | 'filters' | 'highlightedFilterId' | 'highlightedPlantingId' | 'notgood' | 'openEventCardIds' | 'planting' | 'plantings' | 'producer' | 'selectedCropType' | 'selectedFilterId' | 'selectedProducerId' | 'test' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	allFarmOnboardings?: FieldPolicy<any> | FieldReadFunction<any>,
	allPlantings?: FieldPolicy<any> | FieldReadFunction<any>,
	auth?: FieldPolicy<any> | FieldReadFunction<any>,
	filter?: FieldPolicy<any> | FieldReadFunction<any>,
	filters?: FieldPolicy<any> | FieldReadFunction<any>,
	highlightedFilterId?: FieldPolicy<any> | FieldReadFunction<any>,
	highlightedPlantingId?: FieldPolicy<any> | FieldReadFunction<any>,
	notgood?: FieldPolicy<any> | FieldReadFunction<any>,
	openEventCardIds?: FieldPolicy<any> | FieldReadFunction<any>,
	planting?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>,
	producer?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedCropType?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedFilterId?: FieldPolicy<any> | FieldReadFunction<any>,
	selectedProducerId?: FieldPolicy<any> | FieldReadFunction<any>,
	test?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	AuthState?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AuthStateKeySpecifier | (() => undefined | AuthStateKeySpecifier),
		fields?: AuthStateFieldPolicy,
	},
	AuthUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AuthUserKeySpecifier | (() => undefined | AuthUserKeySpecifier),
		fields?: AuthUserFieldPolicy,
	},
	FarmOnboarding?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FarmOnboardingKeySpecifier | (() => undefined | FarmOnboardingKeySpecifier),
		fields?: FarmOnboardingFieldPolicy,
	},
	FarmOnboardingValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FarmOnboardingValueKeySpecifier | (() => undefined | FarmOnboardingValueKeySpecifier),
		fields?: FarmOnboardingValueFieldPolicy,
	},
	Filter?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterKeySpecifier | (() => undefined | FilterKeySpecifier),
		fields?: FilterFieldPolicy,
	},
	FilterParam?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterParamKeySpecifier | (() => undefined | FilterParamKeySpecifier),
		fields?: FilterParamFieldPolicy,
	},
	FilterValueOption?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterValueOptionKeySpecifier | (() => undefined | FilterValueOptionKeySpecifier),
		fields?: FilterValueOptionFieldPolicy,
	},
	FilterValueRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FilterValueRangeKeySpecifier | (() => undefined | FilterValueRangeKeySpecifier),
		fields?: FilterValueRangeFieldPolicy,
	},
	Planting?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingKeySpecifier | (() => undefined | PlantingKeySpecifier),
		fields?: PlantingFieldPolicy,
	},
	PlantingEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingEventKeySpecifier | (() => undefined | PlantingEventKeySpecifier),
		fields?: PlantingEventFieldPolicy,
	},
	PlantingEventDetail?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlantingEventDetailKeySpecifier | (() => undefined | PlantingEventDetailKeySpecifier),
		fields?: PlantingEventDetailFieldPolicy,
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