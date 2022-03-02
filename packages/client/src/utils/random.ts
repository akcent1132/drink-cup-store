import seedrandom from "seedrandom";
import { range, sample, uniqueId } from "lodash";
import { randomNormal, randomBates } from "d3-random";

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
    {
      id: "1",
      type: "seeding",
      color: "violet",
      date: new Date("Thu May 3 2022"),
    },
    {
      id: "2",
      type: "irrigation",
      color: "blue",
      date: new Date("Thu Jun 10 2022"),
    },
    {
      id: "3",
      type: "weed control",
      color: "yellow",
      date: new Date("Thu Jun 27 2022"),
    },
    {
      id: "4",
      type: "irrigation",
      color: "blue",
      date: new Date("Thu Jul 08 2022"),
    },
    {
      id: "5",
      type: "harvest",
      color: "green",
      date: new Date("Thu Jul 29 2022"),
    },
    {
      id: "6",
      type: "tillage",
      color: "red",
      date: new Date("Thu Oct 12 2022"),
    },
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
  
  date.setDate(365 * randomBates.source(rnd)(2)());
  return { type, date, id: uniqueId() };
};

const ZONES = [
  { name: "1a", minF: -60, maxF: -55 },
  { name: "1b", minF: -55, maxF: -50 },
  { name: "2a", minF: -50, maxF: -45 },
  { name: "2b", minF: -45, maxF: -40 },
  { name: "3a", minF: -40, maxF: -35 },
  { name: "3b", minF: -35, maxF: -30 },
  { name: "4a", minF: -30, maxF: -25 },
  { name: "4b", minF: -25, maxF: -20 },
  { name: "5a", minF: -20, maxF: -15 },
  { name: "5b", minF: -15, maxF: -10 },
  { name: "6a", minF: -10, maxF: -5 },
  { name: "6b", minF: -5, maxF: 0 },
  { name: "7a", minF: 0, maxF: 5 },
  { name: "7b", minF: 5, maxF: 10 },
  { name: "8a", minF: 10, maxF: 15 },
  { name: "8b", minF: 15, maxF: 20 },
  { name: "9a", minF: 20, maxF: 25 },
  { name: "9b", minF: 25, maxF: 30 },
  { name: "10a", minF: 30, maxF: 35 },
  { name: "10b", minF: 35, maxF: 40 },
  { name: "11a", minF: 40, maxF: 45 },
  { name: "11b", minF: 45, maxF: 50 },
  { name: "12a", minF: 50, maxF: 55 },
  { name: "12b", minF: 55, maxF: 60 },
  { name: "13a", minF: 60, maxF: 65 },
  { name: "13b", minF: 65, maxF: 70 },
];

export const randomZone = () => {
  const zone = sample(ZONES)!;
  return {
    name: zone.name,
    temp: zone.minF + Math.floor(Math.random() * (zone.maxF - zone.minF + 1)),
  };
};
