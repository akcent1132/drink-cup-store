import { FarmOnboarding } from "../resolvers.generated";
import pMemoize from "p-memoize";
import { isArray, isEmpty, isFinite, isNumber, map, toString } from "lodash";

declare module externalData {
  export interface FarmOnboarding {
    farmDomain: string;
    title: Title;
    surveystack_id: string;
    animals_detail: null;
    animals_total: number;
    area: Area | null;
    area_community: Area | null;
    area_total_hectares: number;
    average_annual_rainfall: number | null;
    average_annual_temperature: number | null;
    bio: null | string;
    certifications_current: CertificationsCurrent;
    certifications_current_detail: string[];
    certifications_future: CertificationsCurrent | null;
    certifications_future_detail: string[];
    climate_zone: ClimateZone | null;
    county: null | string;
    equity_practices: string[];
    farm_leadership_experience: number | null;
    flexible: null;
    goal_1: null | string;
    goal_2: null | string;
    goal_3: null | string;
    hardiness_zone: null | string;
    immediate_data_source: ImmediateDataSource;
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
    management_plans_current: CertificationsCurrent;
    management_plans_current_detail: string[];
    management_plans_future: CertificationsCurrent | null;
    management_plans_future_detail: string[];
    motivations: string[];
    name: string;
    organization: null | string;
    organization_id: null | string;
    preferred: null | string;
    products_animals: any[];
    products_categories: ProductsCategory[];
    products_detail: string[];
    products_value_added: string[];
    records_software: any[];
    records_system: RecordsSystem[];
    role: null | string;
    schema_version: null;
    social: null | string;
    types: Type[];
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

  export enum CertificationsCurrent {
    No = "no",
    Yes = "yes",
  }

  export enum ClimateZone {
    BSk = "BSk",
    Cfa = "Cfa",
    Cfb = "Cfb",
    Csa = "Csa",
    Csb = "Csb",
    DFA = "Dfa",
    Dfb = "Dfb",
    Dsb = "Dsb",
  }

  export enum ImmediateDataSource {
    Surveystack = "surveystack",
  }

  export enum ProductsCategory {
    Agroforestry = "agroforestry",
    Berries = "berries",
    Dairy = "dairy",
    GrainsOther = "grains_other",
    HayAlfalfa = "hay_alfalfa",
    NativeHabitat = "native_habitat",
    OrchardVine = "orchard_vine",
    Pasture = "pasture",
    Rangeland = "rangeland",
    Vegetables = "vegetables",
  }

  export enum RecordsSystem {
    None = "none",
    Paper = "paper",
    Software = "software",
    Spreadsheets = "spreadsheets",
  }

  export enum Title {
    FarmProfile = "Farm Profile",
  }

  export enum Type {
    CommunityGarden = "community_garden",
    CooperativeFarm = "cooperative_farm",
    DirectsaleFarm = "directsale_farm",
    EducationFarm = "education_farm",
    HomeGarden = "home_garden",
    MarketGarden = "market_garden",
    NonprofitFarm = "nonprofit_farm",
    ResearchFarm = "research_farm",
    WholesaleFarm = "wholesale_farm",
  }
}

const floatOrNull = (f: any) => (isNumber(f) && isFinite(f) ? f : null);

export const loadFarmOnboardings = pMemoize(
  async (): Promise<FarmOnboarding[]> => {
    const externalData: externalData.FarmOnboarding[] = await fetch(
      "https://app.surveystack.io/static/coffeeshop/farm_profiles"
    ).then((result) => result.json());

    return externalData.map((farm) => ({
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
