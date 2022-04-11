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

export type Planting = {
  __typename?: 'Planting';
  id?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<PlantingValue>>>;
};

export type PlantingValue = {
  __typename?: 'PlantingValue';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  filter?: Maybe<Array<Maybe<Planting>>>;
  plantings?: Maybe<Array<Maybe<Planting>>>;
  selectedCropType: Scalars['String'];
  test: Scalars['Boolean'];
};


export type QueryFilterArgs = {
  cropType?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
};


export type QueryPlantingsArgs = {
  cropType?: InputMaybe<Scalars['String']>;
};
