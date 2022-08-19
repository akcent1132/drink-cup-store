export type RowData = {
  name: string;
  type: string;
  children?: RowData[];
  showAggregation?: boolean;
};

// export const ROWS: RowData[] = [
//   {
//     name: "Indicators",
//     type: "group",
//     showAggregation: true,
//     children: [
//       {
//         name: "Soil Structure",
//         type: "sub-group",
//         showAggregation: true,
//         children: [
//           { name: "LOI Soil Carbon 0-10cm", type: "value" },
//           { name: "LOI Soil Carbon 10-20cm", type: "value" },
//           { name: "Organic Matter", type: "value" },
//         ],
//       },
//       {
//         name: "Soil Biology",
//         type: "sub-group",
//         showAggregation: true,
//         children: [
//           { name: "Soil Respiration", type: "value" },
//           { name: "LOI Soil Carbon 0-10cm", type: "value" },
//           { name: "LOI Soil Carbon 10-20cm", type: "value" },
//           { name: "Organic Matter", type: "value" },
//         ],
//       },
//       {
//         name: "Product Quality",
//         type: "sub-group",
//         showAggregation: true,
//         children: [
//           { name: "Polyphenols", type: "value" },
//           { name: "Antioxidants", type: "value" },
//           { name: "Proteins", type: "value" },
//           { name: "Brix", type: "value" },
//         ],
//       },
//       {
//         name: "Other",
//         type: "sub-group",
//         showAggregation: true,
//         children: [
//           { name: "Cation Exchange Capacity", type: "value" },
//           { name: "Electrical Conductivity", type: "value" },
//           { name: "Boron", type: "value" },
//           { name: "Iron", type: "value" },
//           { name: "Copper", type: "value" },
//           { name: "Zinc", type: "value" },
//           { name: "Aluminum", type: "value" },
//           { name: "Sulfer", type: "value" },
//         ],
//       },
//     ],
//   },

//   {
//     name: "Weather",
//     type: "group",
//     children: [
//       //      { name: "Growing Degree Days", type: "value" },
//       { name: "Temperature", type: "value" },
//       { name: "Rainfall", type: "value" },
//       { name: "Hardiness zone", type: "value" },
//       //      { name: "Climate Zone", type: "value" },
//     ],
//   },

//   {
//     name: "Soil",
//     type: "group",
//     children: [
//       { name: "Clay %", type: "value" },
//       { name: "Sand %", type: "value" },
//       //      { name: "slope", type: "value" },
//       { name: "pH", type: "value" },
//     ],
//   },

//   {
//     name: "Management",
//     type: "group",
//     children: [
//       { name: "Tillage", type: "value" },
//       { name: "Tillage Index", type: "value" },
//       { name: "Grazing", type: "value" },
//       { name: "Weed Control", type: "value" },
//       { name: "Pest-Disease Control", type: "value" },
//       { name: "Thinning / Pruning", type: "value" },
//       { name: "Amendments", type: "value" },
//       { name: "Irrigation", type: "value" },
//     ],
//   },
// ];

type ValueType = {
  name: string,
  hierarchy: string[],
  isAggregatable: boolean,
  unit?: string, // ? only if it is the same for all values with the same name
  modusId?: string, // ? only if it is the same for all values with the same name
}

export const VALUE_TYPES: ValueType[] = [
  { name: "LOI Soil Carbon 0-10cm", hierarchy: ["Indicators", "Soil Structure"], isAggregatable: true},
  { name: "LOI Soil Carbon 10-20cm", hierarchy: ["Indicators", "Soil Structure"], isAggregatable: true},
  { name: "Organic Matter", hierarchy: ["Indicators", "Soil Structure"], isAggregatable: true},

  { name: "Soil Respiration", hierarchy: ["Indicators", "Soil Biology"], isAggregatable: true},
  { name: "LOI Soil Carbon 0-10cm", hierarchy: ["Indicators", "Soil Biology"], isAggregatable: true},
  { name: "LOI Soil Carbon 10-20cm", hierarchy: ["Indicators", "Soil Biology"], isAggregatable: true},
  { name: "Organic Matter", hierarchy: ["Indicators", "Soil Biology"], isAggregatable: true},

  { name: "Polyphenols", hierarchy: ["Indicators", "Product Quality"], isAggregatable: true},
  { name: "Antioxidants", hierarchy: ["Indicators", "Product Quality"], isAggregatable: true},
  { name: "Proteins", hierarchy: ["Indicators", "Product Quality"], isAggregatable: true},
  { name: "Brix", hierarchy: ["Indicators", "Product Quality"], isAggregatable: true},

  { name: "Cation Exchange Capacity", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Electrical Conductivity", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Boron", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Iron", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Copper", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Zinc", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Aluminum", hierarchy: ["Indicators", "Other"], isAggregatable: true},
  { name: "Sulfer", hierarchy: ["Indicators", "Other"], isAggregatable: true},

  //      { name: "Growing Degree Days", hierarchy: ["Weather"], isAggregatable: false},
  { name: "Temperature", hierarchy: ["Weather"], isAggregatable: false},
  { name: "Rainfall", hierarchy: ["Weather"], isAggregatable: false},
  { name: "Hardiness zone", hierarchy: ["Weather"], isAggregatable: false},
  //      { name: "Climate Zone", hierarchy: ["Weather"], isAggregatable: false},

  { name: "Clay %", hierarchy: ["Soil"], isAggregatable: false},
  { name: "Sand %", hierarchy: ["Soil"], isAggregatable: false},
  //      { name: "slope", hierarchy: ["Soil"], isAggregatable: false},
  { name: "pH", hierarchy: ["Soil"], isAggregatable: false},

  { name: "Tillage", hierarchy: ["Management"], isAggregatable: false},
  { name: "Tillage Index", hierarchy: ["Management"], isAggregatable: false},
  { name: "Grazing", hierarchy: ["Management"], isAggregatable: false},
  { name: "Weed Control", hierarchy: ["Management"], isAggregatable: false},
  { name: "Pest-Disease Control", hierarchy: ["Management"], isAggregatable: false},
  { name: "Thinning / Pruning", hierarchy: ["Management"], isAggregatable: false},
  { name: "Amendments", hierarchy: ["Management"], isAggregatable: false},
  { name: "Irrigation", hierarchy: ["Management"], isAggregatable: false},
];

const convertValueTypes = (valueTypes: ValueType[]): RowData[]  => {
  const rows: RowData[] = [];
  const getGroup = (rows: RowData[], groupName: string, ...subgroups: string[]): RowData  =>  {
    let group = rows.find(r => r.name === groupName);
    if (!group) {
      group = {
        name: groupName,
        type: "group",
        showAggregation: true,
        children: []
      }
      rows.push(group)
    }
    return subgroups.length > 0 ? getGroup(group.children!, subgroups[0], ...subgroups.slice(1)) : group;
  }
  valueTypes.forEach(valueType => {
    const group = getGroup(rows, valueType.hierarchy[0], ...valueType.hierarchy.slice(1))
    group.children!.push({name: valueType.name, type: 'value'})
  })

  return rows;
}

export const ROWS = convertValueTypes(VALUE_TYPES);

