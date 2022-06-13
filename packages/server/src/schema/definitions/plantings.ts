import { gql } from "apollo-server-express";
import random from 'random'
import { range, sample, startCase, sum, uniqueId } from "lodash";
import seedrandom from "seedrandom";
import { Resolvers } from "../../resolvers.generated";

export const typeDefs = gql`
  extend type Query {
    plantings(cropType: String!): [Planting!]!
  }
  type Planting {
    id: String!
    cropType: String!
    values: [PlantingValue!]!
    title: String!
    producer: Producer!
    params: PlantingParams!
    events: [PlantingEvent!]!
    # matchingFilters: [Filter!]!
    # isHighlighted: Boolean!
  }
  type PlantingValue {
    name: String!
    value: Float!
    # plantingId: String!
  }
  type PlantingParams {
    zone: String!
    temperature: String!
    precipitation: String!
    texture: String!
  }

  type PlantingEvent {
    id: String!
    type: String!
    date: String!
  }

  type Producer {
    id: String!
    code: String!
  }
`;

export const resolvers: Partial<Resolvers> = {
  Query: {
    // plantings
    plantings: async (_, args) => {
      const cropType: string = args.cropType;
      return createPlantings(cropType, 3);
    } ,
  },
};

// Fake data generation...

const createPlantings = (
  cropType: string,
  count: number,
  stdMax = 2,
  meanMax = 5
) => {
  const rnd = seedrandom(cropType + "create planting data");
  return range(count).map((i) => {
    const id = uniqueId();
    const values: any[] = [];
    const walk = (rows: any[]) => {
      for (const row of rows) {
        // use the same distribution on the same rows
        const rndValue = seedrandom(cropType + row.name);
        const mean = (rndValue() - 0.5) * meanMax;
        const std = rndValue() * stdMax;
        // TODO add multilpe measurements to some value types
        // const count = countMax * rndValue();
        const norm = random.clone(rnd).normal(mean, std);
        if (row.type === "value") {
          values.push({
            name: row.name,
            value: norm(),
            plantingId: id,
          });
        }
        if (row.children) {
          walk(row.children);
        }
      }
    };
    walk(ROWS);
    const zone = randomZone();
    let texture = [Math.random(), Math.random()];
    texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
    return {
      id,
      cropType,
      values,
      title: `${startCase(cropType)} ${2017 + Math.floor(Math.random() * 6)}`,
      producer: {
        id: uniqueId(),
        code: Math.random().toString(32).slice(-7),
      },
      params: {
        zone: zone.name,
        temperature: zone.temp.toString() + "°",
        precipitation: `${32 + Math.floor(32 * Math.random())}″`,
        texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
      },
      events: range(6 + 6 * Math.random()).map(() => getFarmEvent()),
      matchingFilters: [],
    };
  });
};

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
        name: "Profitability",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Proteins", type: "value" },
          { name: "Density", type: "value" },
          { name: "LOI Soil Carbon", type: "value" },
          { name: "Crop Establishment", type: "value" },
        ],
      },
      {
        name: "Risk Reduction",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "LOI Soil Carbon", type: "value" },
          { name: "Soil Respiration", type: "value" },
          { name: "Available water capacity", type: "value" },
          { name: "Aggregate stability", type: "value" },
          { name: "Organic Matter", type: "value" },
          { name: "Active Carbon", type: "value" },
          { name: "Crop Establishment", type: "value" },
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
          { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          { name: "Density", type: "value" },
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
      { name: "Growing Degree Days", type: "value" },
      { name: "Temperature", type: "value" },
      { name: "Rainfall", type: "value" },
      { name: "Climate Zone", type: "value" },
      { name: "Hardiness Zone", type: "value" },
    ],
  },

  {
    name: "Soil",
    type: "group",
    children: [
      { name: "% clay", type: "value" },
      { name: "% carbon", type: "value" },
      { name: "slope", type: "value" },
      { name: "pH", type: "value" },
    ],
  },

  {
    name: "Management",
    type: "group",
    children: [
      { name: "Tillage", type: "value" },
      { name: "Grazing", type: "value" },
      { name: "Weed Control", type: "value" },
      { name: "Pest-Disease Control", type: "value" },
      { name: "Thinning / Pruning", type: "value" },
      { name: "Amendments", type: "value" },
      { name: "Irrigation", type: "value" },
    ],
  },
];

const ZONES = [
  { name: "1a", minF: -60, maxF: -55 },
  { name: "1b", minF: -55, maxF: -50 },
  { name: "2a", minF: -50, maxF: -45 },
  { name: "2b", minF: -45, maxF: -40 },
  { name: "3a", minF: -40, maxF: -35 },
  { name: "3b", minF: -35, maxF: -30 },
  { name: "4a", minF: -30, maxF: -25 },
  { name: "4b", minF: -25, maxF: -20 },
  { name: "5a", minF: -20, maxF: -15 },
  { name: "5b", minF: -15, maxF: -10 },
  { name: "6a", minF: -10, maxF: -5 },
  { name: "6b", minF: -5, maxF: 0 },
  { name: "7a", minF: 0, maxF: 5 },
  { name: "7b", minF: 5, maxF: 10 },
  { name: "8a", minF: 10, maxF: 15 },
  { name: "8b", minF: 15, maxF: 20 },
  { name: "9a", minF: 20, maxF: 25 },
  { name: "9b", minF: 25, maxF: 30 },
  { name: "10a", minF: 30, maxF: 35 },
  { name: "10b", minF: 35, maxF: 40 },
  { name: "11a", minF: 40, maxF: 45 },
  { name: "11b", minF: 45, maxF: 50 },
  { name: "12a", minF: 50, maxF: 55 },
  { name: "12b", minF: 55, maxF: 60 },
  { name: "13a", minF: 60, maxF: 65 },
  { name: "13b", minF: 65, maxF: 70 },
];

export const randomZone = () => {
  const zone = sample(ZONES)!;
  return {
    name: zone.name,
    temp: zone.minF + Math.floor(Math.random() * (zone.maxF - zone.minF + 1)),
  };
};

export const getFarmEvent = (seed?: string) => {
  const rnd = seedrandom(seed);
  const eventTypes = [
    "amendments",
    "weeding",
    "harvest",
    "seeding",
    "tillage",
    "irrigation",
  ];
  const type = eventTypes[Math.floor(eventTypes.length * rnd())]!;
  const date = new Date("2022");

  date.setDate(365 * random.clone(rnd).bates(2)());
  return {
    type,
    date: date.toString(),
    id: uniqueId(),
  };
};
