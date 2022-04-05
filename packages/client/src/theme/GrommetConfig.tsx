import { useTheme } from "@emotion/react";
import { Grommet, ThemeType } from "grommet";
import { PropsWithChildren } from "react";

// addDecorator(withThemes(ThemeProvider, [theme]))
// add emotion theme
export const GrommetConfig = ({ children }: PropsWithChildren<{}>) => {
  const theme = useTheme();
  const grommetTheme: ThemeType = {
    global: {
      colors: {
        brand: theme.colors.primary,
        // background: theme.colors.darkTransparent,
        "accent-1": theme.colors.secondary,
      },
      font: {
        family: theme.font,
        size: "14px",
        height: "20px",
      },
      drop: {
        border: {
          radius: "12px",
        },
        //@ts-ignore remove default enter animation
        extend: "animation: none; opacity: 1;"
      },
      // elevation: {
      //   dark: {
      //     none: "none",
      //     // You can override the values for box-shadow here.
      //     xsmall: "0px 2px 2px rgba(0, 0, 0, 0.40)",
      //     small: "0px 4px 4px rgba(0, 0, 0, 0.40)",
      //     medium: "0px 6px 8px rgba(0, 0, 0, 0.40)",
      //     large: "0px 8px 16px rgba(0, 0, 0, 0.40)",
      //     xlarge: "0px 12px 24px rgba(0, 0, 0, 0.40)",
      //   },
      //   light: {
      //     none: "none",
      //     // You can override the values for box-shadow here.
      //     xsmall: "0px 2px 2px rgba(0, 0, 0, 0.40)",
      //     small: "0px 4px 4px rgba(0, 0, 0, 0.40)",
      //     medium: "0px 6px 8px rgba(0, 0, 0, 0.40)",
      //     large: "0px 8px 16px rgba(0, 0, 0, 0.40)",
      //     xlarge: "0px 12px 24px rgba(0, 0, 0, 0.40)",
      //   },
      // },
    },
    nameValueList: {
      gap: { column: "0px", row: "3px" },
      pair: {
        column: {
          gap: { column: "xsmall", row: "xsmall" },
        },
      },
      name: {
        width: "xsmall",
      },
      value: {
        width: "medium",
      },
    },
    nameValuePair: {
      name: { size: 'xsmall'}
    },
  };

  return (
    <Grommet theme={grommetTheme} themeMode="dark">
      {" "}
      {children}
    </Grommet>
  );
};
