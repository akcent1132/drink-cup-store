// Only used in stories (*.storie.tsx). 
// It makes the theme editable on the storybook UI.

import { Theme, ThemeProvider, withTheme } from "@emotion/react";
import * as knobs from "@storybook/addon-knobs"
import React from "react";

interface WithLoadingProps {
  theme: Theme;
}

export const withEditableTheme = <P extends object>(
  Component: React.ComponentType<P>
) =>
  withTheme(class WithTheme extends React.Component<P & WithLoadingProps> {
    render() {
      const { theme, ...props } = this.props;
      const t = knobs.object('theme', {
          ...theme,
      }, 'theme')
      return (
        <ThemeProvider theme={t}>
          <Component {...(props as P)} />
        </ThemeProvider>
      );
    }
  });
