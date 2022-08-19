import { FarmOnboarding } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isArray, isEmpty, isFinite, isNumber, map, toString } from "lodash";
import { surveyStackApiUrl } from "../../utils/env";

declare module externalData {
  export interface FarmOnboarding {
    farmDomain: string;
    title: string;
    surveystack_id: string;
    animals_detail: null;
    animals_total: number;
    area: Area | null;
    area_community: Area | null;
    area_total_hectares: number;
    average_annual_rainfall: number | null;
    average_annual_temperature: number | null;
    bio: null | string;
    certifications_current: string;
    certifications_current_detail: string[];
    certifications_future: null | string;
    certifications_future_detail: string[];
    climate_zone: null | string;
    county: null | string;
    equity_practices: string[];
    farm_leadership_experience: number | null;
    flexible: null;
    goal_1: null | string;
    goal_2: null | string;
    goal_3: null | string;
    hardiness_zone: null | string;
    immediate_data_source: string;
    indigenous_territory: string[];
    interest: string[];
    land_other: string[];
    land_other_detail: null | string;
    land_type_detail: null | string;
    location_address_line1: null | string;
    location_address_line2: null | string;
    location_administrative_area: null;
    location_country_code: null | string;
    location_locality: null | string;
    location_postal_code: null | string;
    management_plans_current: string;
    management_plans_current_detail: string[];
    management_plans_future: null | string;
    management_plans_future_detail: string[];
    motivations: string[];
    name: string;
    organization: null | string;
    organization_id: null | string;
    preferred: null | string;
    products_animals: any[];
    products_categories: string[];
    products_detail: string[];
    products_value_added: string[];
    records_software: any[];
    records_system: string[];
    role: null | string;
    schema_version: null;
    social: null | string;
    types: string[];
    unique_id: null;
    units: null | string;
  }

  export interface Area {
    value: string;
    geo_type: string;
    lat: number;
    lon: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    geohash: string;
    latlon: string;
  }
}

const floatOrNull = (f: any) => (isNumber(f) && isFinite(f) ? f : null);

export const loadFarmOnboardings = pMemoize(
  async (): Promise<FarmOnboarding[]> => {
    const externalData: externalData.FarmOnboarding[] = await fetch(
      surveyStackApiUrl("static/coffeeshop/farm_profiles")
    ).then((result) => result.json());

    return externalData.map((farm) => ({
      id: [farm.farmDomain, farm.surveystack_id].join(),
      farmDomain: toString(farm.farmDomain) || null,
      climateZone: toString(farm.climate_zone) || null,
      averageAnnualTemperature: floatOrNull(farm.average_annual_temperature),
      averageAnnualRainfall: floatOrNull(farm.average_annual_rainfall),
      values: map(farm, (values, key) => ({
        key,
        values: (isArray(values) ? values : [values])
          .filter((x) => !isEmpty(x))
          .map(toString),
      })),
    }));
  }
);
