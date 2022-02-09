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
  - `yarn chromatic`: Deploys storybook to chromatic
  - `yarn server:start`: Starts server