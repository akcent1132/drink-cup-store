import { FilterParamDataSource, Maybe } from "../../graphql.generated";
import { FilterEditorQuery } from "./FilterEditor.generated";

const farmProfileFilterProperties = [
  { key: "farmDomain", type: "string" },
  { key: "title", type: "string" },
  // { key: "surveystack_id", type: "string" },
  // { key: "animals_detail", type: "n/a" },
  { key: "animals_total", type: "number" },
  // { key: "area", type: "n/a" },
  // { key: "area_community", type: "n/a" },
  { key: "area_total_hectares", type: "number" },
  { key: "average_annual_rainfall", type: "number" },
  { key: "average_annual_temperature", type: "number" },
  // { key: "bio", type: "n/a" },
  { key: "certifications_current", type: "string" },
  { key: "certifications_current_detail", type: "string" },
  // { key: "certifications_future", type: "n/a" },
  // { key: "certifications_future_detail", type: "n/a" },
  { key: "climate_zone", type: "string" },
  // { key: "conditions_detail", type: "string" },
  { key: "county", type: "string" },
  // { key: "equity_practices", type: "n/a" },
  // { key: "farm_leadership_experience", type: "n/a" },
  // { key: "flexible", type: "n/a" },
  // { key: "goal_1", type: "n/a" },
  // { key: "goal_2", type: "n/a" },
  // { key: "goal_3", type: "n/a" },
  { key: "hardiness_zone", type: "string" },
  { key: "immediate_data_source", type: "string" },
  // { key: "indigenous_territory", type: "n/a" },
  { key: "interest", type: "string" },
  // { key: "land_other", type: "n/a" },
  // { key: "land_other_detail", type: "n/a" },
  // { key: "land_type_detail", type: "n/a" },
  { key: "location_address_line1", type: "string" },
  { key: "location_address_line2", type: "string" },
  // { key: "location_administrative_area", type: "n/a" },
  { key: "location_country_code", type: "string" },
  { key: "location_locality", type: "string" },
  { key: "location_postal_code", type: "string" },
  { key: "management_plans_current", type: "string" },
  { key: "management_plans_current_detail", type: "string" },
  // { key: "management_plans_future", type: "n/a" },
  // { key: "management_plans_future_detail", type: "n/a" },
  { key: "motivations", type: "string" },
  // { key: "name", type: "string" },
  { key: "organization", type: "string" },
  // { key: "organization_id", type: "n/a" },
  // { key: "preferred", type: "n/a" },
  // { key: "products_animals", type: "n/a" },
  { key: "products_categories", type: "string" },
  // { key: "products_detail", type: "n/a" },
  // { key: "products_value_added", type: "n/a" },
  // { key: "records_software", type: "n/a" },
  { key: "records_system", type: "string" },
  { key: "role", type: "string" },
  // { key: "schema_version", type: "n/a" },
  // { key: "social", type: "n/a" },
  { key: "types", type: "string" },
  // { key: "unique_id", type: "n/a" },
  { key: "units", type: "string" },
];

type FilterableNumeric = {
  type: "numeric";
  key: string;
  modusId?: string;
  values: number[];
  dataSource: FilterParamDataSource,
};
type FilterableOption = {
  type: "option";
  key: string;
  options: {
    value: string;
    occurences: number;
  }[];
  dataSource: FilterParamDataSource,
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
            dataSource: FilterParamDataSource.Values
          };
        }
        acc[value.name].values.push(value.value);
        return acc;
      }, {} as { [key: string]: FilterableNumeric })
  );

  const options: FilterableOption[] = [
    {
      type: 'option',
      key: "test_options",
      options: [
        { value: "value1", occurences: 123 },
        { value: "value2", occurences: 123 },
        { value: "value3", occurences: 123 },
      ],
      dataSource: FilterParamDataSource.FarmOnboarding
    },
  ];
  return [...values, ...options];
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
