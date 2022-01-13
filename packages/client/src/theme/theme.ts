const colors = {
  purple: "#5d54af",
  blue: "#1d6bb3",
  teal: "#017e9c",
  green: "#339e2c",
  olive: "#a1bc0b",
  yellow: "#ffe603",
  orange: "#ff8500",
  red: "#f40000",
  violet: "#c42687",
  darkTransparent: "rgba(23,23,23,.5)",
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
  color: (color: string) => (colors as IDictionary)[color] || color,
  colors,
  fonts,
};
