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
  name: string;
  hierarchy: string[];
  isAggregatable?: boolean | null;
  unit?: string | null; // ? only if it is the same for all values with the same name
  modus_test_id?: string | null; // ? only if it is the same for all values with the same name
};

export const VALUE_TYPES: ValueType[] = [
  {
    name: "Temperature",
    isAggregatable: false,
    unit: "mm/month",
    modus_test_id: "B-AO.19.01",
    hierarchy: ["Weather"],
  },
  {
    name: "Antioxidants",
    isAggregatable: true,
    modus_test_id: "B-AO.19.01",
    hierarchy: ["Indicators", "Product Quality"],
  },
  {
    name: "Polyphenols",
    isAggregatable: true,
    modus_test_id: "B-PLY.19.01",
    hierarchy: ["Indicators", "Product Quality"],
  },
  {
    name: "Proteins",
    isAggregatable: true,
    modus_test_id: "B-LPR.19.01",
    hierarchy: ["Indicators", "Product Quality"],
  },
  {
    name: "Brix",
    isAggregatable: true,
    modus_test_id: "B-BX.20.15",
    hierarchy: ["Indicators", "Product Quality"],
  },
  {
    name: "Pest-Disease Control",
    isAggregatable: false,
    hierarchy: ["Management"],
  },
  {
    name: "Thinning / Prunning",
    isAggregatable: false,
    hierarchy: ["Management"],
  },
  { name: "Amendment", isAggregatable: false, hierarchy: ["Management"] },
  { name: "Irrigation", isAggregatable: false, hierarchy: ["Management"] },
  {
    name: "pH",
    isAggregatable: false,
    modus_test_id: "S-PH-1:1.02.07",
    hierarchy: ["Soil"],
  },
  {
    name: "Organic Matter",
    isAggregatable: true,
    modus_test_id: "S-SOM-LOI.15",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Sulfur",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-S-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Phosphorus",
    isAggregatable: true,
    modus_test_id: "S-P-M3.04",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Calcium",
    isAggregatable: true,
    modus_test_id: "S-CA-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Magnesium",
    isAggregatable: true,
    modus_test_id: "S-MG-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Potassium",
    isAggregatable: true,
    modus_test_id: "S-K-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Sodium",
    isAggregatable: true,
    modus_test_id: "S-NA-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Boron",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-B-M3.04",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Iron",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-FE-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Manganese",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-MN-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Copper",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-CU-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Zinc",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-ZN-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Aluminum",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-AL-M3.05",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Carbonate",
    isAggregatable: true,
    unit: "ppm",
    modus_test_id: "S-CO3-SP.12",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Soil Mo Available Ppm",
    isAggregatable: true,
    unit: "ppm",
    hierarchy: ["Indicators", "Other"],
  },
  {
    name: "Electrical Conductivity",
    isAggregatable: true,
    modus_test_id: "S-EC-1:2.03",
    hierarchy: ["Indicators", "Other"],
  },
];

export const covertNormalizedRows = (valueTypes: ValueType[]): RowData[] => {
  const rows: RowData[] = [];
  const getGroup = (
    rows: RowData[],
    groupName: string,
    ...subgroups: string[]
  ): RowData => {
    let group = rows.find((r) => r.name === groupName);
    if (!group) {
      group = {
        name: groupName,
        type: "group",
        showAggregation: true,
        children: [],
      };
      rows.push(group);
    }
    return subgroups.length > 0
      ? getGroup(group.children!, subgroups[0], ...subgroups.slice(1))
      : group;
  };
  valueTypes.forEach((valueType) => {
    const group = getGroup(
      rows,
      valueType.hierarchy[0],
      ...valueType.hierarchy.slice(1)
    );
    group.children!.push({ name: valueType.name, type: "value" });
  });

  return rows;
};

export const ROWS = covertNormalizedRows(VALUE_TYPES);
