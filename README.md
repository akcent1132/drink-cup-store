# Getting Started with Create React App

<<<<<<< HEAD
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

=======
## Development

### Requirements

- Node
- Yarn

### Installing Dependencies

1. Install monorepo root dependencies: `yarn`
2. Install dependencies of projects within the monorepo: `yarn lerna bootstrap``

### Yarn Scripts / Commands

- `yarn codegen`: Starts the code generator (builds TS types for GraphQL queries)
- `yarn client`: Starts the client with hotreloading
- `yarn test`: Starts Jest with watching
- `yarn chromatic`: Deploys storybook to chromatic (unused atm)
- `yarn storybook`: Starts storybook for development (unused atm)
- `yarn server`: Starts server (unused atm)

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
>>>>>>> leftbra
