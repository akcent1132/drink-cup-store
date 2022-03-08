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
        const useBackgroundImage = knobs.boolean(
          "UseBackgroundImage",
          theme.useBackgroundImage,
          "theme.colors"
        );
        const colors = mapValues(theme.colors, (c, name) =>
          knobs.color(name, c, "theme.colors")
        );
        const iconEventsBar = knobs.object(
          "IconEventsBar",
          { ...theme.iconEventsBar },
          "theme.IconEventsBar"
        );
        const eventsCard = knobs.object(
          "EventsCard",
          { ...theme.eventsCard },
          "theme.EventsCard"
        );
        const valueDistribution = knobs.object(
          "ValueDistribution",
          { ...theme.valueDistribution },
          "theme.ValueDistribution"
        );
        const valuePopup = knobs.object(
          "ValuePopup",
          { ...theme.valuePopup },
          "theme.ValuePopup"
        );
        const filterLabel = knobs.object(
          "FilterLabel",
          { ...theme.filterLabel },
          "theme.FilterLabel"
        );
        const t = {
          ...theme,
          colors,
          iconEventsBar,
          valueDistribution,
          valuePopup,
          filterLabel,
          eventsCard,
          useBackgroundImage,
        };
        return (
          <ThemeProvider theme={t}>
            <Component {...(props as P)} />
          </ThemeProvider>
        );
      }
    }
  );
