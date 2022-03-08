import { useTheme } from "@emotion/react";
import { Grommet, ThemeType } from "grommet";
import { PropsWithChildren } from "react";

// addDecorator(withThemes(ThemeProvider, [theme]))
// add emotion theme
export const GrommetConfig = ({ children }: PropsWithChildren<{}>) => {
  const theme = useTheme();
  console.log("theme.colors.primary", theme.colors.primary)
  const grommetTheme: ThemeType = {
    global: {
      colors: {
        brand: theme.colors.primary,
        background: theme.colors.darkTransparent,
        "accent-1": theme.colors.secondary,
      },
      font: {
        family: theme.font,
        size: "14px",
        height: "20px",
      },
    },
  };

  return <Grommet theme={grommetTheme} themeMode='dark'> {children}</Grommet>;
};
