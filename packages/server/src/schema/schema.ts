import * as example from './definitions/example'
import * as aggregatorV1 from './definitions/aggregatorV1'
import * as farmos from './definitions/farmos'

export const typeDefs = [
  example.typeDefs,
  aggregatorV1.typeDefs,
  farmos.typeDefs,
]

export const resolvers = [
  example.resolvers,
  aggregatorV1.resolvers,
  farmos.resolvers,
]