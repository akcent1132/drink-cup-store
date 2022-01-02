export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "dark green",
    values: [
      {
        name: "dark green",
        value: "#4B5F25",
      },
      {
        name: "light",
        value: "#ffffff",
      },
      {
        name: "dark",
        value: "#333333",
      },
    ],
  },
};
