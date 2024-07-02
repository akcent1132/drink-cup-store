import seedrandom from "seedrandom";
import { range, sample, uniqueId } from "lodash";
import { randomNormal, randomBates } from "d3-random";
import { PlantingEvent } from "../graphql.generated";

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

// export const getFarmEvent = (seed?: string): PlantingEvent => {
//   const rnd = seedrandom(seed);
//   const eventTypes = [
//     "amendments",
//     "weeding",
//     "harvest",
//     "seeding",
//     "tillage",
//     "irrigation",
//   ];
//   const type = eventTypes[Math.floor(eventTypes.length * rnd())]!;
//   const date = new Date("2022");

//   date.setDate(365 * randomBates.source(rnd)(2)());
//   return {
//     __typename: "PlantingEvent",
//     type,
//     date: date.toString(),
//     id: uniqueId(),
//     details: [],
//     detailsKey: null,
//   };
// };

const ZONES = [
  { name: "4a", minF: 45, maxF: 50 },
  { name: "4b", minF: 48, maxF: 53 },
  { name: "5a", minF: 53, maxF: 56 },
  { name: "5b", minF: 56, maxF: 59 },
  { name: "6a", minF: 59, maxF: 62 },
  { name: "6b", minF: 62, maxF: 65 },
  { name: "7a", minF: 65, maxF: 68 },
  { name: "7b", minF: 68, maxF: 71 },
  { name: "8a", minF: 71, maxF: 74 },
  { name: "8b", minF: 73, maxF: 76 },
];

export const randomZone = () => {
  const zone = sample(ZONES)!;
  return {
    name: zone.name,
    temp: zone.minF + Math.floor(Math.random() * (zone.maxF - zone.minF + 1)),
  };
};
