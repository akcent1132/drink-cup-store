import { defaultTheme as iconEventsBarTheme } from "../components/IconEventsBar";
import { defaultTheme as valueDistributionTheme } from "../components/ValueDistribution";
import { defaultTheme as eventsCardTheme } from "../components/EventsCard";
import { defaultTheme as valuePopupTheme } from "../components/ValuePopup";
import { defaultTheme as filterLabelTheme } from "../components/FilterLabel";
import createTheme from "@mui/material/styles/createTheme";

const colors = {
  // purple: "#5d54af",
  // blue: "#1d6bb3",
  // teal: "#017e9c",
  // green: "#339e2c",
  // olive: "#a1bc0b",
  // yellow: "#ffe603",
  // orange: "#ff8500",
  // red: "#f40000",
  // violet: "#c42687",
  primary: "#7cb342",
  secondary: "#ffea00",
  darkTransparent: "rgba(23,23,23,.5)",
  bg: "#181818",
  bgTab: "#212121",
  bgSidePanel: "#333333",
  divider: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  treeTitlePrimary: "#444444",
  treeTitleSecondary: "#333333",
  treeBgPrimary: "#444444",
  treeBgSecondary: "#333333",
};

interface IDictionary {
  [index: string]: string;
}

const fonts = {
  base: "Acumin Pro",
  baseItalic: "Acumin Pro Italic",
  baseBold: "Acumin Pro Bold",
  baseBoldItalic: "Acumin Pro Bold Italic",
};

const muiTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#7cb342",
    },
    secondary: {
      main: "#ffea00",
    },
  },
});
console.log("MUI THEME", muiTheme);

export const theme = {
  color(color: string) {
    return (this.colors as IDictionary)[color] || color;
  },
  colors,
  fonts,
  font: "'Roboto', sans-serif",
  iconEventsBar: iconEventsBarTheme,
  eventsCard: eventsCardTheme,
  valuePopup: valuePopupTheme,
  valueDistribution: valueDistributionTheme,
  filterLabel: filterLabelTheme,
  useBackgroundImage: true,
  ...muiTheme,
};

export const regularColor = (t: typeof theme, color: string) =>
  (t.colors as IDictionary)[color] || color;
