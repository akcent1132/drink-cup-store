import { FarmOnboarding } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isArray, isEmpty, map, toString } from "lodash";

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

export const loadFarmOnboardings = pMemoize(
  async (): Promise<FarmOnboarding[]> => {
    const externalData: externalData.FarmOnboarding[] = await fetch(
      "https://app.surveystack.io/static/coffeeshop/farm_profiles"
    ).then((result) => result.json());

    return externalData.map((farm) => ({
      farmDomain: toString(farm.farmDomain),
      values: map(farm, (values, key) => ({
        key,
        values: (isArray(values) ? values : [values])
          .filter(x => !isEmpty(x))
          .map(toString),
      })),
    }));
  }
);
