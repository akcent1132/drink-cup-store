import React from "react";
import { App } from "./stories/Dashboard";
import { Global, css } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import { GrommetConfig } from "./theme/GrommetConfig";
import CssBaseline from "@mui/material/CssBaseline";

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
        <GrommetConfig>
          <CssBaseline />
          <App iframeSrc="https://www.hylo.com/all" />
        </GrommetConfig>
      </ThemeProvider>
    </div>
  );
}

export default Main;
