import { FarmOnboarding } from "../resolvers.generated";
import pMemoize from "p-memoize";

declare module externalData {
  export interface FarmOnboarding {
    farmDomain: string;
    title: string;
    surveystack_id: string;
    animals_detail: null;
    animals_total: number;
    area: null;
    area_community: null;
    area_total_hectares: number;
    average_annual_rainfall: number | null;
    average_annual_temperature: number | null;
    bio: null;
    certifications_current: NSCurrent;
    certifications_current_detail: string[];
    certifications_future: null;
    certifications_future_detail: any[];
    climate_zone: null | string;
    conditions_detail: null | string;
    county: null | string;
    equity_practices: any[];
    farm_leadership_experience: null;
    flexible: null;
    goal_1: null;
    goal_2: null;
    goal_3: null;
    hardiness_zone: null | string;
    immediate_data_source: ImmediateDataSource;
    indigenous_territory: any[];
    interest: string[];
    land_other: any[];
    land_other_detail: null;
    land_type_detail: null;
    location_address_line1: null | string;
    location_address_line2: null | string;
    location_administrative_area: null;
    location_country_code: null | string;
    location_locality: null | string;
    location_postal_code: null | string;
    management_plans_current: NSCurrent;
    management_plans_current_detail: string[];
    management_plans_future: null;
    management_plans_future_detail: any[];
    motivations: string[];
    name: string;
    organization: null | string;
    organization_id: null;
    preferred: null;
    products_animals: any[];
    products_categories: string[];
    products_detail: any[];
    products_value_added: any[];
    records_software: any[];
    records_system: RecordsSystem[];
    role: null | string;
    schema_version: null;
    social: null;
    types: string[];
    unique_id: null;
    units: null | string;
  }

  export enum NSCurrent {
    No = "no",
    Yes = "yes",
  }

  export enum ImmediateDataSource {
    Surveystack = "surveystack",
  }

  export enum RecordsSystem {
    None = "none",
    Paper = "paper",
    Spreadsheets = "spreadsheets",
  }
}

const toString = (value: any) => (value ? String(value) : null);
const toInt = (value: any) =>
  Number.isFinite(Number.parseInt(value)) ? Number.parseInt(value) : null;
const toFloat = (value: any) =>
  Number.isFinite(Number.parseFloat(value)) ? Number.parseFloat(value) : null;
const toStringList = (value: any) =>
  (Array.isArray(value) ? value : [value])
    .map((v) => String(v))
    .filter(Boolean);



export const loadFarmOnboardings = pMemoize(async (): Promise<FarmOnboarding[]> => {
  const externalData: externalData.FarmOnboarding[] = await fetch(
    "https://app.surveystack.io/static/coffeeshop/farm_profiles"
  ).then((result) => result.json());

  return externalData.map((farm) => ({
    farmDomain: toString(farm.farmDomain),
    title: toString(farm.title),
    surveystack_id: toString(farm.surveystack_id),
    animals_total: toInt(farm.animals_total),
    area_total_hectares: toFloat(farm.area_total_hectares),
    average_annual_rainfall: toFloat(farm.average_annual_rainfall),
    average_annual_temperature: toFloat(farm.average_annual_temperature),
    certifications_current: toStringList(farm.certifications_current),
    certifications_current_detail: toStringList(
      farm.certifications_current_detail
    ),
    certifications_future: toStringList(farm.certifications_future),
    certifications_future_detail: toStringList(
      farm.certifications_future_detail
    ),
    climate_zone: toString(farm.climate_zone),
    conditions_detail: toString(farm.conditions_detail),
    county: toString(farm.county),
    equity_practices: toStringList(farm.equity_practices),
    goals: toStringList([farm.goal_1, farm.goal_2, farm.goal_3]),
    hardiness_zone: toString(farm.hardiness_zone),
    immediate_data_source: toString(farm.immediate_data_source),
    interest: toStringList(farm.interest),
    location_address_line1: toString(farm.location_address_line1),
    location_address_line2: toString(farm.location_address_line2),
    location_country_code: toString(farm.location_country_code),
    location_locality: toString(farm.location_locality),
    location_postal_code: toString(farm.location_postal_code),
    management_plans_current: toString(farm.management_plans_current),
    management_plans_current_detail: toStringList(
      farm.management_plans_current_detail
    ),
    motivations: toStringList(farm.motivations),
    name: toString(farm.name),
    organization: toString(farm.organization),
    products_categories: toStringList(farm.products_categories),
    records_system: toStringList(farm.records_system),
    role: toString(farm.role),
    types: toStringList(farm.types),
    units: toString(farm.units),
  }));
});
