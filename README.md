# Coffee Shop

## Development
### Requirements
  - Node
  - Yarn

### Installing Dependencies
  1. Install monorepo root dependencies: `yarn`
  2. Install dependencies of projects within the monorepo: `yarn lerna bootstrap`

### Yarn Scripts / Commands
  - `yarn storybook`: Starts storybook for development
  - `yarn codegen`: Starts the code generator (builds TS types for GraphQL queries)
  - `yarn chromatic`: Deploys storybook to chromatic
  - `yarn server`: Starts server

  - `yarn docker:up`: Build and run dev container
  - `yarn docker:down`: Stop dev container
  - `yarn docker:storybook`: run `yarn storybook` in docker
  - `yarn docker:chromatic`: run `yarn chromatic` in docker
  - `yarn docker:server`: run `yarn server` in docker
  - `yarn docker:client`: run `yarn client` in docker
  - `yarn docker:codegen`: run `yarn codegen` in docker
  - `yarn docker:bash`: Get dev contaienr CLI

### Development with docker
 - Start with `yarn docker:up`
 - Run codegen with `yarn docker:codegen` (Warning: it doesn't show errors for some reason. Run in outside docker with `yarn codegen` if you can)
 - Run `yarn docker:server` or other service listed above
 - Stop with `yarn docker:down`