import { countBy, isEmpty, map, mapValues, sortBy, uniq } from "lodash";
import { FilterParamDataSource, Maybe } from "../../graphql.generated";
import { FilterEditorQuery } from "./FilterEditor.generated";

type FilterableNumeric = {
  type: "numeric";
  key: string;
  modusId?: string;
  values: number[];
  dataSource: FilterParamDataSource;
};
type FilterableOption = {
  type: "option";
  key: string;
  options: {
    value: string;
    occurences: number;
  }[];
  dataSource: FilterParamDataSource;
};
export type Filterable = FilterableNumeric | FilterableOption;

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
  );

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
  console.log("farmValuesRaw", farmValuesRaw);
  const farmValues: Filterable[] = map(farmValuesRaw, (values, key) => {
    values = values.filter((x) => !isEmpty(x));

    const numValues = uniq(values.map((v) => Number.parseFloat(v)));
    if (numValues.every((v) => Number.isFinite(v))) {
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
  console.log("farmValues", farmValues);
  return sortBy([...values, ...farmValues], 'key');
};

//   let filterId = 0;
//   const createFilter = (
//     color: string,
//     name: string,
//     cropType: string
//   ): Filter => {
//     const id = (++filterId).toString();
//     const p = [].filter((p) => p.cropType === cropType);
//     const values = p
//       .map((p) => p.values)
//       .flat()
//       .reduce((acc, value) => {
//         if (!(value.name in acc)) {
//           acc[value.name] = {
//             values: [],
//             modusId: value.modusId,
//           };
//         }
//         acc[value.name].values.push(value.value);
//         return acc;
//       }, {} as { [key: string]: { values: number[]; modusId: Maybe<string> } });

//     const valueParams: Filterable[] = Object.keys(values).map((key) => ({
//       __typename: "Filterable" as "Filterable",
//       key,
//       modusId: values[key].modusId,
//       active: false,
//       value: {
//         __typename: "FilterValueRange" as "FilterValueRange",
//         values: uniq(values[key].values).sort(),
//         min: Math.min(...values[key].values),
//         max: Math.max(...values[key].values),
//       },
//       dataSource: FilterableDataSource.Values,
//     }));

//     const farmIdsInPlantings = uniq(plantings().map((p) => p.producer.id));
//     const relevantFarms = omitBy(
//       farmProfiles(),
//       (p) => !farmIdsInPlantings.includes(p.farmDomain)
//     );

//     const farmParams: Filterable[] = farmProfileFilterProperties
//       .map(({ key, type }) => {
//         if (type === "number") {
//           const values: number[] = uniq(
//             Object.values(relevantFarms)
//               .map((p) => get(p, key))
//               .flat()
//               .map(toNumber)
//               .filter(isNumber)
//           ).sort();
//           return {
//             key,
//             value: {
//               __typename: "FilterValueRange" as "FilterValueRange",
//               values,
//               min: Math.min(...values),
//               max: Math.max(...values),
//             },
//           };
//         }
//         if (type === "string") {
//           let allOptions: string[] = Object.values(relevantFarms)
//             .map((p) => get(p, key))
//             .flat()
//             .map(toString)
//             .filter((s) => isString(s) && s !== "");
//           const occurenceMap = countBy(allOptions)
//           allOptions = uniq(allOptions).sort()
//           const occurences = allOptions.map(option => occurenceMap[option])
//           return {
//             key,
//             value: {
//               __typename: "FilterValueOption" as "FilterValueOption",
//               allOptions,
//               occurences,
//               options: [],
//             },
//           };
//         }
//       })
//       .filter(Boolean)
//       .map((param) => {
//         return {
//           __typename: "Filterable" as "Filterable",
//           active: false,
//           modusId: null,
//           dataSource: FilterableDataSource.FarmOnboarding,
//           ...param!,
//         };
//       });

//     // Remove empty filter params
//     const params = [...valueParams, ...farmParams].filter(
//       (p) =>
//         (p.value.__typename === "FilterValueOption" &&
//           p.value.allOptions.length > 0) ||
//         (p.value.__typename === "FilterValueRange" && p.value.values.length > 1)
//     );

//     console.log({ params });
//     return {
//       __typename: "Filter",
//       id,
//       name,
//       cropType,
//       color,
//       plantings: [],
//       params,
//       isHighlighted: false,
//     };
//   };
