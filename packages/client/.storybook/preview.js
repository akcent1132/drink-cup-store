import { ThemeProvider } from "@emotion/react";
import { addDecorator } from "@storybook/react";
import { theme } from "../src/theme/theme";

// add emotion theme
addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
));

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
