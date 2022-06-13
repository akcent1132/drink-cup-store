import * as example from './definitions/example'
// import * as aggregatorV1 from './definitions/aggregatorV1'
// import * as farmos from './definitions/farmos'
import * as plantings from './definitions/plantings'

export const typeDefs = [
  example.typeDefs,
  // aggregatorV1.typeDefs,
  // farmos.typeDefs,
  plantings.typeDefs,
]

export const resolvers = [
  example.resolvers,
  // aggregatorV1.resolvers,
  // farmos.resolvers,
  plantings.resolvers
]