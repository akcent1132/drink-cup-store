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

export type FarmOnboarding = {
  __typename: 'FarmOnboarding';
  averageAnnualRainfall: Maybe<Scalars['Float']>;
  averageAnnualTemperature: Maybe<Scalars['Float']>;
  climateZone: Maybe<Scalars['String']>;
  farmDomain: Maybe<Scalars['String']>;
  values: Maybe<Array<FarmOnboardingValue>>;
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
  params: PlantingParams;
  producer: Producer;
  title: Scalars['String'];
  values: Array<PlantingValue>;
};

export type PlantingEvent = {
  __typename: 'PlantingEvent';
  _planting_id_for_details_request: Scalars['String'];
  _producer_key_for_details_request: Scalars['String'];
  date: Scalars['String'];
  details: Maybe<Array<PlantingEventDetail>>;
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
  clayPercentage: Maybe<Scalars['Int']>;
  sandPercentage: Maybe<Scalars['Int']>;
  soilGroup: Maybe<Scalars['String']>;
  soilOrder: Maybe<Scalars['String']>;
  soilSuborder: Maybe<Scalars['String']>;
  soilTexture: Maybe<Scalars['Int']>;
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
  highlightedFilterId: Maybe<Scalars['String']>;
  planting: Maybe<Planting>;
  plantings: Array<Planting>;
  producer: Maybe<Producer>;
};


export type QueryPlantingArgs = {
  id: InputMaybe<Scalars['String']>;
};


export type QueryPlantingsArgs = {
  cropType: Scalars['String'];
};


export type QueryProducerArgs = {
  id: InputMaybe<Scalars['String']>;
};

export type FarmOnboardingKeySpecifier = ('averageAnnualRainfall' | 'averageAnnualTemperature' | 'climateZone' | 'farmDomain' | 'values' | FarmOnboardingKeySpecifier)[];
export type FarmOnboardingFieldPolicy = {
	averageAnnualRainfall?: FieldPolicy<any> | FieldReadFunction<any>,
	averageAnnualTemperature?: FieldPolicy<any> | FieldReadFunction<any>,
	climateZone?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type PlantingKeySpecifier = ('cropType' | 'events' | 'farmOnboarding' | 'id' | 'params' | 'producer' | 'title' | 'values' | PlantingKeySpecifier)[];
export type PlantingFieldPolicy = {
	cropType?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	farmOnboarding?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	params?: FieldPolicy<any> | FieldReadFunction<any>,
	producer?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlantingEventKeySpecifier = ('_planting_id_for_details_request' | '_producer_key_for_details_request' | 'date' | 'details' | 'id' | 'type' | PlantingEventKeySpecifier)[];
export type PlantingEventFieldPolicy = {
	_planting_id_for_details_request?: FieldPolicy<any> | FieldReadFunction<any>,
	_producer_key_for_details_request?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	details?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type PlantingParamsKeySpecifier = ('clayPercentage' | 'sandPercentage' | 'soilGroup' | 'soilOrder' | 'soilSuborder' | 'soilTexture' | PlantingParamsKeySpecifier)[];
export type PlantingParamsFieldPolicy = {
	clayPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	sandPercentage?: FieldPolicy<any> | FieldReadFunction<any>,
	soilGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	soilOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	soilSuborder?: FieldPolicy<any> | FieldReadFunction<any>,
	soilTexture?: FieldPolicy<any> | FieldReadFunction<any>
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
export type QueryKeySpecifier = ('allFarmOnboardings' | 'allPlantings' | 'highlightedFilterId' | 'planting' | 'plantings' | 'producer' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	allFarmOnboardings?: FieldPolicy<any> | FieldReadFunction<any>,
	allPlantings?: FieldPolicy<any> | FieldReadFunction<any>,
	highlightedFilterId?: FieldPolicy<any> | FieldReadFunction<any>,
	planting?: FieldPolicy<any> | FieldReadFunction<any>,
	plantings?: FieldPolicy<any> | FieldReadFunction<any>,
	producer?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
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