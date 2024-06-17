import { countBy, isEmpty, map, sortBy, uniq } from "lodash";
import { FilterParamDataSource } from "../../states/filters";
import { FilterEditorQuery } from "./FilterEditor.generated";

export type FilterableNumeric = {
  type: "numeric";
  key: string;
  modusId?: string;
  values: number[];
  dataSource: FilterParamDataSource;
};
export type FilterableOption = {
  type: "option";
  key: string;
  options: {
    value: string;
    occurences: number;
  }[];
  dataSource: FilterParamDataSource;
};
export type Filterable = FilterableNumeric | FilterableOption;

export const isOptionFilterable = (
  filterable: Filterable
): filterable is FilterableOption => {
  return filterable.type === "option";
};
export const isNumericFilterable = (
  filterable: Filterable
): filterable is FilterableNumeric => {
  return filterable.type === "numeric";
};

const BLACKLIST = [
  "location_address_line1",
  "location_address_line2",
  "name",
  "role",
  "units",
  "organization",
  "organization_id",
  "farmDomain",
];

const FORCE_OPTION_TYPE = ["location_postal_code"];

// TODO add tests
export const getFilterables = (
  plantings: FilterEditorQuery["plantings"]
): Filterable[] => {
  const values: FilterableNumeric[] = Object.values(
    plantings
      .map((p) => p.values)
      .flat()
      .reduce((acc, value) => {
        if (!(value.name in acc)) {
          acc[value.name] = {
            type: "numeric",
            key: value.name,
            values: [],
            modusId: value.modusId || undefined,
            dataSource: FilterParamDataSource.Values,
          };
        }
        acc[value.name].values.push(value.value);
        return acc;
      }, {} as { [key: string]: FilterableNumeric })
  )
    .map((filterable) => ({ ...filterable, values: uniq(filterable.values) }))
    .filter((filterable) => filterable.values.length > 2);

  const isSomething = <T>(x: T | null | undefined): x is T =>
    x !== undefined && x !== null;

  const farmValuesRaw = plantings
    .map((p) => p.farmOnboarding?.values)
    .flat()
    .filter(isSomething)
    .reduce((acc, { key, values }) => {
      if (!(key in acc)) {
        acc[key] = [];
      }
      acc[key].push(...values);
      return acc;
    }, {} as { [key: string]: string[] });
  const farmValues: Filterable[] = map(farmValuesRaw, (values, key) => {
    values = values.filter((x) => !isEmpty(x));

    const numValues = uniq(values.map((v) => Number.parseFloat(v)));
    if (
      !FORCE_OPTION_TYPE.includes(key) &&
      numValues.every((v) => Number.isFinite(v))
    ) {
      if (numValues.length < 2) {
        return null;
      }
      return {
        type: "numeric" as "numeric",
        key,
        values: numValues,
        modusId: undefined,
        dataSource: FilterParamDataSource.FarmOnboarding,
      };
    } else {
      const options = map(countBy(values), (occurences, value) => ({
        occurences,
        value,
      }));
      return {
        type: "option" as "option",
        key,
        options,
        modusId: undefined,
        dataSource: FilterParamDataSource.FarmOnboarding,
      };
    }
  }).filter(isSomething);

  return sortBy([...values, ...farmValues], "key").filter(
    ({ key }) => !BLACKLIST.includes(key)
  );
};
