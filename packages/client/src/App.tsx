import React from "react";
import { App } from "./stories/Dashboard";
import { ThemeProvider, Global, css } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import { GrommetConfig } from "./theme/GrommetConfig";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./theme/muiTheme";

function Main() {
  return (
    <div>
      <Global
        styles={css`
          body {
            padding: 0 !important;
          }
        `}
      />
      <ThemeProvider theme={theme}>
        {/* <MuiThemeProvider theme={muiTheme}> */}
          <GrommetConfig>
            <CssBaseline />
            <App iframeSrc="https://www.hylo.com/all" />
          </GrommetConfig>
        {/* </MuiThemeProvider> */}
      </ThemeProvider>
    </div>
  );
}

export default Main;
