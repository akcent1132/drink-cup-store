import { gql } from "apollo-server-express";
import { get } from "lodash-es";
import farmOS from "farmos";

const test_farms = [
  "crowriverfarm.farmos.dev",
  "gardenvarietyharvests.farmos.dev",
  "apricotlanefarms.farmos.dev",
  "squashblossomfarm.farmos.dev",
  "tewncfarms.farmos.dev",
  "jimsheppard.farmos.dev",
  "goodcheer.farmos.dev",
  "buddingmoonfarm.farmos.dev",
  "rockin7.farmos.dev",
];

const clients: {
  [key: string]: any;
} = {};

const getClient = (host: string): Promise<any> => {
  if (!process.env.FARMOS_TEST_USER) {
    throw new Error("process.env.FARMOS_TEST_USER not set (update .env)");
  }
  if (!process.env.FARMOS_TEST_PASS) {
    throw new Error("process.env.FARMOS_TEST_PASS not set (update .env)");
  }

  if (clients[host]) {
    return clients[host];
  }

  let token: string;
  const options = {
    remote: {
      host,
      clientId: "farm",
      getToken: () => token,
      setToken: (t: string) => {
        token = t;
      },
    },
  };

  const farm = farmOS.default(options);
  clients[host] = farm.remote
    .authorize(process.env.FARMOS_TEST_USER, process.env.FARMOS_TEST_PASS)
    .then(() => farm);
  return clients[host];
};

export const typeDefs = gql`
  type Self {
    href: String
  }

  type Related {
    href: String
  }

  type Links {
    self: Self
    related: Related
  }

  type Image {
    links: Links
    data: [String]
  }

  type File {
    links: Links
    data: [String]
  }

  type Category {
    links: Links
    data: [String]
  }

  type Relationships {
    # owner: Owner
    # quantity: Quantity
    # location: Location
    image: Image
    file: File
    category: Category
    # asset: Asset
    # uid: Uid
    # revision_user: RevisionUser
    # log_type: LogType
  }

  type Geometry {
    value: String
    geo_type: String
    lat: Float
    lon: Float
    left: Float
    top: Float
    right: Float
    bottom: Float
    geohash: String
    latlon: String
  }

  type Attributes {
    drupal_internal__id: Int
    drupal_internal__revision_id: Int
    langcode: String
    revision_created: String
    revision_log_message: String
    name: String
    timestamp: String
    status: String
    created: String
    changed: String
    default_langcode: Boolean
    revision_translation_affected: Boolean
    data: String
    notes: String
    is_movement: Boolean
    lot_number: String
    quick: [String]
    geometry: Geometry
    flag: [String]
  }

  type HarvestLog {
    type: String
    id: String
    relationships: Relationships
    attributes: Attributes
    links: Links
  }

  type Farm {
    harvestLogs: [HarvestLog]
  }
  type Query {
    "Test getting some data from FarmOS"
    farm: Farm
  }
`;

export const resolvers = {
  Query: {
    farm: async () => {
      return {};
    },
  },
  Farm: {
    harvestLogs: async () => {
      const response = await getClient("https://crowriverfarm.farmos.dev");
      return get(response, "data.data");
    },
  },
};
