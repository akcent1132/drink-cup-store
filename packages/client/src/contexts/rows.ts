export type RowData = {
  name: string;
  type: string;
  children?: RowData[];
  showAggregation?: boolean;
};

export const ROWS: RowData[] = [
  {
    name: "Indicators",
    type: "group",
    showAggregation: true,
    children: [
      {
        name: "Soil Structure",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "LOI Soil Carbon 0-10cm", type: "value" },
          { name: "LOI Soil Carbon 10-20cm", type: "value" },
          { name: "Organic Matter", type: "value" },
        ],
      },
      {
        name: "Soil Biology",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Soil Respiration", type: "value" },
          { name: "LOI Soil Carbon 0-10cm", type: "value" },
          { name: "LOI Soil Carbon 10-20cm", type: "value" },
          { name: "Organic Matter", type: "value" },
        ],
      },
      {
        name: "Product Quality",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Polyphenols", type: "value" },
          { name: "Antioxidants", type: "value" },
          { name: "Proteins", type: "value" },
          { name: "Brix", type: "value" },
        ],
      },
      {
        name: "Other",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Cation Exchange Capacity", type: "value" },
          { name: "Electrical Conductivity", type: "value" },
          { name: "Boron", type: "value" },
          { name: "Iron", type: "value" },
          { name: "Copper", type: "value" },
          { name: "Zinc", type: "value" },
          { name: "Aluminum", type: "value" },
          { name: "Sulfer", type: "value" },
        ],
      },
    ],
  },
  // { name: "Animal Health", type: "group", children: [] },
  // { name: "Soil Structure", type: "group", children: [] },
  // { name: "Soil Fertility", type: "group", children: [] },
  // { name: "Soil Biology", type: "group", children: [] },
  // { name: "Environment", type: "group", children: [] },

  {
    name: "Weather",
    type: "group",
    children: [
      //      { name: "Growing Degree Days", type: "value" },
      { name: "Temperature", type: "value" },
      { name: "Rainfall", type: "value" },
      { name: "Hardiness zone", type: "value" },
      //      { name: "Climate Zone", type: "value" },
    ],
  },

  {
    name: "Soil",
    type: "group",
    children: [
      { name: "Clay %", type: "value" },
      { name: "Sand %", type: "value" },
      //      { name: "slope", type: "value" },
      { name: "pH", type: "value" },
    ],
  },

  {
    name: "Management",
    type: "group",
    children: [
      { name: "Tillage", type: "value" },
      { name: "Tillage Index", type: "value" },
      { name: "Grazing", type: "value" },
      { name: "Weed Control", type: "value" },
      { name: "Pest-Disease Control", type: "value" },
      { name: "Thinning / Pruning", type: "value" },
      { name: "Amendments", type: "value" },
      { name: "Irrigation", type: "value" },
    ],
  },
];
