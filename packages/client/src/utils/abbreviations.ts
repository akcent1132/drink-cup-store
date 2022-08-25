type Dict = { [key: string]: string };

const firstCharacter: Dict = {
  A: "Tropical",
  B: "Dry",
  C: "Mild Temperate",
  D: "Snow",
  E: "Polar",
};
const secondCharacter: Dict = {
  f: "Fully humid",
  m: "Monsoon",
  s: "Dry summer",
  w: "Dry winter",
  W: "Desert",
  S: "Steppe",
  T: "Tundra",
  F: "Frost",
};
const thirdCharacter: Dict = {
  h: "Hot arid",
  k: "Cold arid",
  a: "Hot summer",
  b: "Warm summer",
  c: "Cool summer",
  d: "Cold summer",
};

export const climateRegionToLongName = (abbreviation: string) => {
  if (abbreviation.length !== 3) {
    console.error(`Invalid climate region: "${abbreviation}`);
    return abbreviation;
  }
  return [
    firstCharacter[abbreviation[0]],
    secondCharacter[abbreviation[1]],
    thirdCharacter[abbreviation[2]],
  ].join(" - ");
};
