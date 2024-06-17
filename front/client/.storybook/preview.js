import { ThemeProvider } from "@emotion/react";
import { addDecorator } from "@storybook/react";
// import { withThemes } from '@react-theming/storybook-addon';
import { theme } from "../src/theme/theme";
import { GrommetConfig } from "../src/theme/GrommetConfig";

// addDecorator(withThemes(ThemeProvider, [theme]))
// add emotion theme
addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <GrommetConfig>
      <Story />
    </GrommetConfig>
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
    default: "dark",
    values: [
      {
        name: "dark green",
        value: "#181818",
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
