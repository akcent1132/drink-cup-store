import React from "react";
import { App } from "./stories/Dashboard";
import { ThemeProvider, Global, css } from "@emotion/react";
import { theme } from "./theme/theme";
import { GrommetConfig } from "./theme/GrommetConfig";

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
          <App iframeSrc="https://www.hylo.com/all" />
        </GrommetConfig>
      </ThemeProvider>
    </div>
  );
}

export default Main;
