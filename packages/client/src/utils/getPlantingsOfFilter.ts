import { intersection } from "lodash";
import {
  Filter,
  FilterParam,
  FilterParamDataSource,
  isOptionFilterParam,
  isRangeFilterParam,
} from "../states/filters";

type Planting = {
  id: string;
  values: {
    name: string;
    value: number;
  }[];
  farmOnboarding?: {
    values?:
      | {
          key: string;
          values: string[];
        }[]
      | null;
  } | null;
};

const isMatchingFarmOnboardingValue = (
  planting: Planting,
  param: FilterParam
) => {
  // values of this planting
  const values =
    (planting.farmOnboarding?.values || []).find((v) => v.key === param.key)
      ?.values || [];

  if (isOptionFilterParam(param)) {
    return param.value.options.some((option) => values.includes(option));
  } else if (isRangeFilterParam(param)) {
    const numValues = values
      .map((v) => Number.parseFloat(v))
      .filter((v) => Number.isFinite(v));
    // don't filter if the planting has no value for this property
    if (numValues.length === 0) {
      return true;
    }
    return numValues.some((v) => v >= param.value.min && v <= param.value.max);
  }
};

// Matching rules:
// - Range values match if
//   - planting has any value (with the given key) in the given range
//   - planting has no value with the given key
// - Option values match
//   - if the planting has a matching value (with the given key) with the selected option
export const getPlantingIdsOfFilter = (
  filter: Filter,
  plantings: Planting[]
) => {
  console.time(`getPlantingsOfFilter ${filter.id}`);

  const activeParams = filter.params.filter((p) => p.active);
  let filteredPlantings = plantings;

  if (activeParams.length === 0) {
    filteredPlantings = [];
  } else {
    filteredPlantings = intersection(
      ...activeParams.map((param) => {
        for (const param of activeParams) {
          if (param.dataSource === FilterParamDataSource.FarmOnboarding) {
            return plantings.filter((planting) =>
              isMatchingFarmOnboardingValue(planting, param)
            );
          } else {
            if (isRangeFilterParam(param)) {
              return plantings.filter((planting) => {
                const values = planting.values.filter(
                  (value) => value.name === param.key
                );
                return (
                  values.length === 0 ||
                  values.some(
                    ({ value }) =>
                      value >= param.value.min && value <= param.value.max
                  )
                );
              });
            }
          }
        }
      })
    );
  }

  console.timeEnd(`getPlantingsOfFilter ${filter.id}`);

  return filteredPlantings.map((p) => p.id);
};
