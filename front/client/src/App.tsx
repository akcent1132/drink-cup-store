import { css, Global } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { App } from "./components/Dashboard";
import { theme } from "./theme/theme";

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
        <CssBaseline />
        <App iframeSrc="https://www.hylo.com/all" />
      </ThemeProvider>
    </div>
  );
}

export default Main;
