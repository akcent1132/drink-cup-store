import seedrandom from "seedrandom";
import { range } from "lodash";
import { randomNormal } from "d3-random";

// Standard Normal variate using Box-Muller transform.
export function randn_bm() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export const genDataPoints = (
  seed = "0",
  countMax = 100,
  stdMax = 2,
  meanMax = 5
) => {
  const rnd = seedrandom(seed);
  const count = countMax * rnd();
  const mean = rnd() * meanMax;
  const std = rnd() * stdMax;
  const norm = randomNormal.source(rnd)(mean, std);
  return range(count).map(() => norm());
};

export const getFarmEvents = () => {
  return [
    { type: "seeding", color: "violet", date: new Date("Thu May 3 2022") },
    { type: "irrigation", color: "blue", date: new Date("Thu Jun 10 2022") },
    {
      type: "weed control",
      color: "yellow",
      date: new Date("Thu Jun 27 2022"),
    },
    { type: "irrigation", color: "blue", date: new Date("Thu Jul 08 2022") },
    { type: "harvest", color: "green", date: new Date("Thu Jul 29 2022") },
    { type: "tillage", color: "red", date: new Date("Thu Oct 12 2022") },
  ];
};

export const getFarmEvent = (seed?: string) => {
  const rnd = seedrandom(seed);
  const eventTypes = [
    "amendments",
    "weeding",
    "harvest",
    "seeding",
    "tillage",
    "irrigation",
  ];
  const type = eventTypes[Math.floor(eventTypes.length * rnd())];
  const date = new Date("2022");
  date.setDate(365 * rnd());
  return { type, date };
};
