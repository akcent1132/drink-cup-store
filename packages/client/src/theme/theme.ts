import { defaultTheme as iconEventsBarTheme } from "../components/IconEventsBar";
import { defaultTheme as valueDistributionTheme } from "../components/ValueDistribution";

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
  treeBgSecondary: "#333333"
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

export const theme = {
  color(color: string) {
    return (this.colors as IDictionary)[color] || color;
  },
  colors,
  fonts,
  font: "'Roboto', sans-serif",
  iconEventsBar: iconEventsBarTheme,
  valueDistribution: valueDistributionTheme,
  useBackgroundImage: true,
};

export const regularColor = (t: typeof theme, color: string) =>
  (t.colors as IDictionary)[color] || color;
