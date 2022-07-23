import { makeVar } from "@apollo/client";
import { get, memoize } from "lodash";
import { FilterParamDataSource } from "../../graphql.generated";
import { client } from "../client";
import { PlantingsDocument, PlantingsQuery } from "./filter.generated";

type FilterResult = { hash: string; plantings: PlantingsQuery["plantings"] };
type Param = NonNullable<PlantingsQuery["filter"]>["params"][number];
type Planting = PlantingsQuery["plantings"][number];

const isMatchingFarmOnboardingValue = (planting: Planting, param: Param) => {
  // values of this planting
  const values =
    (planting.farmOnboarding?.values || []).find((v) => v.key === param.key)
      ?.values || [];
  const paramValue = param.value;
  if (paramValue.__typename === "FilterValueOption") {
    return paramValue.options.some((option) => values.includes(option));
  } else {
    const numValues = values
      .map((v) => Number.parseFloat(v))
      .filter((v) => Number.isFinite(v));
    // don't filter if the planting has no value for this property
    if (numValues.length === 0) {
      return true;
    }
    return numValues.some((v) => v >= paramValue.min && v <= paramValue.max);
  }
};

// Matching rules:
// - Range values match if
//   - planting has any value (with the given key) in the given range
//   - planting has no value with the given key
// - Option values match
//   - if the planting has a matching value (with the given key) with the selected option
export const getPlantingsOfFilterVar = memoize(
  (filterId: string, cropType: string) => {
    console.time(`Create new filtered planting var ${{filterId, cropType}}`)
    const plantingsVar = makeVar<FilterResult>({ hash: "", plantings: [] });
    client
      .watchQuery({
        query: PlantingsDocument,
        variables: { cropType, filterId },
      })
      .subscribe((observer) => {
        console.time(`getPlantingsOfFilterVar ${filterId}`)
        const { plantings, filter } = (observer.data || {}) as PlantingsQuery;
        if (!filter) {
          return;
        }
        const hash = `${JSON.stringify(filter.params)}-${plantings.length}`;

        // Skip recomputing if hash didn't change
        if (hash === plantingsVar().hash) {
          return;
        }

        const activeParams = filter.params.filter((p) => p.active);
        let filteredPlantings = plantings;

        if (activeParams.length === 0) {
          filteredPlantings = [];
        } else {
          for (const param of activeParams) {
            if (param.dataSource === FilterParamDataSource.FarmOnboarding) {
              filteredPlantings = filteredPlantings.filter((planting) =>
                isMatchingFarmOnboardingValue(planting, param)
              );
            } else {
              const paramValue = param.value;
              if (paramValue.__typename === "FilterValueRange") {
                filteredPlantings = filteredPlantings.filter((planting) => {
                  return planting.values.some(
                    ({ value }) =>
                      value >= paramValue.min && value <= paramValue.max
                  );
                });
              }
            }
          }
        }
        
        
        console.timeEnd(`getPlantingsOfFilterVar ${filterId}`)
        plantingsVar({ hash, plantings: filteredPlantings });
      });
    return plantingsVar;
  },
  (cropType, filterId) => `${cropType}#${filterId}`
);
