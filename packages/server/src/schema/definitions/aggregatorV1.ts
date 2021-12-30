import { gql } from "apollo-server-express";
import axios from "axios";

export const typeDefs = gql`
  type Crop {
    uri: String
    id: String
    resource: String
    name: String
  }

  type Uid {
    uri: String
    id: String
    resource: String
  }

  type FarmAsset {
    id: String
    name: String
    type: String
    created: String
    changed: String
    archived: String
    url: String
    geometry: String
    data: String
    crop: [Crop]
    season: [String]
    parent: [String]
    flags: [String]
    images: [String]
    files: [String]
    description: [String]
    location: [String]
    uid: Uid
  }

  type Query {
    "Test getting some data from FarmOS aggregator"
    farmAssets: [FarmAsset]
  }
`;

export const resolvers = {
  Query: {
    farmAssets: async () => {
      if (!process.env.FARMOS_AGGREGATOR_KEY) {
        throw new Error("process.env.FARMOS_AGGREGATOR_KEY not set (update .env)");
      }
      if (!process.env.FARMOS_AGGREGATOR_URL) {
        throw new Error("process.env.FARMOS_AGGREGATOR_URL not set (update .env)");
      }
      if (!process.env.FARMOS_AGGREGATOR_FARM_URL) {
        throw new Error("process.env.FARMOS_AGGREGATOR_FARM_URL not set (update .env)");
      }
      const r = await axios.get(
        `${process.env.FARMOS_AGGREGATOR_URL}/api/v1/farms/assets/?farm_url=${process.env.FARMOS_AGGREGATOR_FARM_URL}`,
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.FARMOS_AGGREGATOR_KEY,
          },
        }
      );
      return Object.values(r.data).flat();
    },
  },
};
