// Only used in stories (*.storie.tsx).
// It makes the theme editable on the storybook UI.

import { Theme, ThemeProvider, withTheme } from "@emotion/react";
import * as knobs from "@storybook/addon-knobs";
import { mapValues } from "lodash";
import React from "react";

interface WithLoadingProps {
  theme: Theme;
}

export const withEditableTheme = <P extends object>(
  Component: React.ComponentType<P>
) =>
  withTheme(
    class WithTheme extends React.Component<P & WithLoadingProps> {
      render() {
        const { theme, ...props } = this.props;
        const colors = mapValues(theme.colors, (c, name) =>
          knobs.color(name, c, "theme.colors")
        );
        const iconEventsBar = knobs.object(
          "IconEventsBar",
          {...theme.iconEventsBar},
          "theme.IconEventsBar"
        );
        const t = { ...theme, colors, iconEventsBar };
        return (
          <ThemeProvider theme={t}>
            <Component {...(props as P)} />
          </ThemeProvider>
        );
      }
    }
  );
