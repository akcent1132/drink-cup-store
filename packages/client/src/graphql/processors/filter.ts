import { makeVar } from "@apollo/client";
import { get, memoize } from "lodash";
import { FilterParamDataSource } from "../../graphql.generated";
import { client } from "../client";
import { PlantingsDocument, PlantingsQuery } from "./filter.generated";

type FilterResult = { hash: string; plantings: PlantingsQuery["plantings"] };

// Matching rules:
// - Range values math if
//   - planting has any value (with the given key) in the given range
//   - planting has no value with the given key
// - Option values match
//   - if the planting has a matching value (with the given key) with the selected option
export const getPlantingsOfFilterVar = memoize(
  (filterId: string, cropType: string) => {
    const plantingsVar = makeVar<FilterResult>({ hash: "", plantings: [] });
    client
      .watchQuery({
        query: PlantingsDocument,
        variables: { cropType, filterId },
      })
      .subscribe((observer) => {
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

        const farms = {}; //TODO

        if (activeParams.length === 0) {
          filteredPlantings = [];
        } else {
          for (const param of activeParams) {
            const { value } = param;
            if (value.__typename === "FilterValueRange") {
              filteredPlantings = filteredPlantings.filter((p) => {
                const values =
                  param.dataSource === FilterParamDataSource.Values
                    ? p.values.filter((v) => v.name === param.key)
                    : [get(farms, [p.producer.id, param.key])].flat();
                return values.every(
                  (v) => v.value >= value.min && v.value <= value.max
                );
              });
            } else if (value.__typename === "FilterValueOption") {
              filteredPlantings = filteredPlantings.filter((p) => {
                const optionsInPlanting = [
                  get(farms, [p.producer.id, param.key]),
                ].flat();
                if (optionsInPlanting.filter(Boolean).length) {
                  console.log(p.producer.id, param.key, { optionsInPlanting });
                }
                return optionsInPlanting.some((o) => value.options.includes(o));
              });
            }
          }
        }
        plantingsVar({ hash, plantings: filteredPlantings });
      });
    return plantingsVar;
  },
  (cropType, filterId) => `${cropType}#${filterId}`
);
