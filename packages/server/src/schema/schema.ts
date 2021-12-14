import * as example from './definitions/example'
import * as aggregatorV1 from './definitions/aggregatorV1'

export const typeDefs = [
  example.typeDefs,
  aggregatorV1.typeDefs,
]

export const resolvers = [
  example.resolvers,
  aggregatorV1.resolvers,
]