/** @jsxImportSource @emotion/react */

import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import "../index.css";
import bgCorn from "../assets/images/Background-corngrains.jpg";
import logoImage from "../assets/images/Farmers-coffeeshop-logo-white_transparent.png";
import { Tabs } from "../components/Tabs";
import { css, useTheme, withTheme } from "@emotion/react";
import { getFarmEvent, randomZone } from "../utils/random";
import { Button } from "../components/Button";
import { EventsCard } from "../components/EventsCard";
import faker from "faker";
import { memoize, range, sample, sum, uniq, uniqueId, without } from "lodash";
import { HyloBox } from "./HyloBox";
import useScrollPosition from "@react-hook/window-scroll";
import { useWindowWidth } from "@react-hook/window-size";
import { RowData, Filtering, NestedRows, PlantingData } from "./NestedRows";
import { schemeTableau10 } from "d3-scale-chromatic";
import seedrandom from "seedrandom";
import { randomNormal } from "d3-random";
import { HoveredPlantingProvider } from "../contexts";

const Root = withTheme(styled.div`
  width: 100%;
  height: 100%;
  min-height: 1600px;
  padding-left: 52px;
  box-sizing: border-box;
  ${(p) =>
    p.theme.useBackgroundImage
      ? `
      background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 4) 0%,
        rgba(0, 0, 0, 0.34) 10%
      ),
      url(${bgCorn});
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
  `
      : ""}

  background-color: ${(p) => p.theme.colors.bg};
  display: grid;
  grid-template-columns: 1fr max(500px, 34%);
  grid-template-rows: 60px auto;
  grid-template-areas: "values header" "values events";
  & > * {
    overflow: hidden;
    max-width: 100%;
  }
`);

const Header = styled.div`
  grid-area: header;
  display: flex;
  justify-content: flex-end;
  padding: 0 40px;
`;

const PaneHead = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 20px 20px 20px;
`;

const RightSide = styled.div`
  grid-area: events;
`;

const Events = styled.div`
  display: flex;
  padding: 0px 40px 50px 0px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
`;

const COLORS = schemeTableau10.slice(0, 9); //[
//   "purple",
//   "blue",
//   "teal",
//   "green",
//   "olive",
//   "yellow",
//   "orange",
//   // "red",
//   "violet",
// ];

const ROWS: RowData[] = [
  {
    name: "Indicators	",
    type: "group",
    showAggregation: true,
    children: [
      {
        name: "Profitability	",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Proteins", type: "value" },
          { name: "Density", type: "value" },
          { name: "LOI Soil Carbon", type: "value" },
          { name: "Crop Establishment", type: "value" },
        ],
      },
      {
        name: "Risk Reduction	",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "LOI Soil Carbon", type: "value" },
          { name: "Soil Respiration", type: "value" },
          { name: "Available water capacity", type: "value" },
          { name: "Aggregate stability", type: "value" },
          { name: "Organic Matter", type: "value" },
          { name: "Active Carbon", type: "value" },
          { name: "Crop Establishment", type: "value" },
        ],
      },
      {
        name: "Product Quality	",
        type: "sub-group",
        showAggregation: true,
        children: [
          { name: "Polyphenols", type: "value" },
          { name: "Antioxidants", type: "value" },
          { name: "Proteins", type: "value" },
          { name: "Brix", type: "value" },
          { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          // { name: "Minerals", type: "value" },
          { name: "Density	", type: "value" },
        ],
      },
    ],
  },
  // { name: "Animal Health	", type: "group", children: [] },
  // { name: "Soil Structure	", type: "group", children: [] },
  // { name: "Soil Fertility	", type: "group", children: [] },
  // { name: "Soil Biology	", type: "group", children: [] },
  // { name: "Environment	", type: "group", children: [] },

  {
    name: "Weather	",
    type: "group",
    children: [
      { name: "Growing Degree Days", type: "value" },
      { name: "Temperature", type: "value" },
      { name: "Rainfall", type: "value" },
      { name: "Climate Zone", type: "value" },
      { name: "Hardiness Zone", type: "value" },
    ],
  },

  {
    name: "Soil	",
    type: "group",
    children: [
      { name: "% clay", type: "value" },
      { name: "% carbon", type: "value" },
      { name: "slope", type: "value" },
      { name: "pH", type: "value" },
    ],
  },

  {
    name: "Management	",
    type: "group",
    children: [
      { name: "Tillage", type: "value" },
      { name: "Grazing", type: "value" },
      { name: "Weed Control", type: "value" },
      { name: "Pest-Disease Control", type: "value" },
      { name: "Thinning / Pruning", type: "value" },
      { name: "Amendments", type: "value" },
      { name: "Irrigation", type: "value" },
    ],
  },
];

let plantingDataId = 0;
const createFilteringData = (
  filteringName: string,
  countMax = 12,
  stdMax = 2,
  meanMax = 5
): PlantingData[][] => {
  const rnd = seedrandom(filteringName);
  return range(rnd() * countMax).map(() => {
    const values: { name: string; value: number; id: string }[] = [];
    const id = (plantingDataId++).toString();
    const walk = (rows: RowData[]) => {
      for (const row of rows) {
        const rndValue = seedrandom(filteringName + row.name);
        // TODO add multilpe measurements to some value types
        // const count = countMax * rndValue();
        const mean = (rndValue() - 0.5) * meanMax;
        const std = rndValue() * stdMax;
        const norm = randomNormal.source(rnd)(mean, std);
        if (row.type === "value") {
          values.push({ name: row.name, value: norm(), id });
        }
        if (row.children) {
          walk(row.children);
        }
      }
    };
    walk(ROWS);
    return values;
  });
};

function hoverReducer(
  state: string | null,
  action: { type: "enter" | "leave"; name: string }
) {
  switch (action.type) {
    case "enter":
      return action.name;
    case "leave":
      return state === action.name ? null : state;
    default:
      throw new Error();
  }
}

const RandomContent = ({
  onClickData,
}: {
  onClickData: (data: PlantingData, color: string) => void;
}) => {
  const { colors } = useTheme();
  const [hoverState, hoverDispatch] = useReducer(hoverReducer, null);
  const [filterings, setFilterings] = useState<Filtering[]>([]);
  const averageValues = createFilteringData("average", 36, 5, 2);
  const addFilter = useCallback(
    (name?: string, color?: string) => {
      const freeColors = without(COLORS, ...filterings.map((g) => g.color));
      name = name || faker.company.companyName();
      const filtering = {
        name,
        color: color || sample(freeColors.length > 0 ? freeColors : COLORS)!,
        plantings: createFilteringData(name, 12, 3, 2),
      };
      setFilterings([...filterings, filtering]);
      return filtering;
    },
    [filterings]
  );
  const removeGroup = useCallback(
    (name: string) => {
      setFilterings(filterings.filter((g) => g.name !== name));
    },
    [filterings]
  );

  useEffect(() => {
    setFilterings([
      addFilter("Produce Corn, Beef", schemeTableau10[4]),
      addFilter("General Mills - KS", schemeTableau10[0]),
    ]);
  }, []);

  return (
    <RowContainer>
      <PaneHead>
        {[...filterings].reverse().map((group, i) => (
          <Button
            key={i}
            label={group.name}
            color={group.color}
            onClick={() => removeGroup(group.name)}
            onMouseEnter={() =>
              hoverDispatch({ type: "enter", name: group.name })
            }
            onMouseLeave={() =>
              hoverDispatch({ type: "leave", name: group.name })
            }
            isWide
          />
        ))}
        <Button
          label="+ Add"
          color={colors.bgSidePanel}
          onClick={() => addFilter()}
        />
      </PaneHead>
      <NestedRows
        rows={ROWS}
        filterings={filterings}
        hoverState={hoverState}
        averageValues={averageValues}
        onClickData={onClickData}
      />
    </RowContainer>
  );
};

const createFakePlantingCardData = memoize((id: string, color: string) => {
  let texture = [Math.random(), Math.random()];
  texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
  const zone = randomZone();
  return {
    id,
    title: "Corn " + (2017 + Math.floor(Math.random() * 6)),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    color,
    params: {
      zone: zone.name,
      temperature: zone.temp.toString(),
      precipitation: `${32 + Math.floor(32 * Math.random())} in`,
      texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
    },
    events: range(6 + 6 * Math.random()).map(() => getFarmEvent()),
  };
});

const legendEntries = [
  { color: "red", name: "tillage" },
  { color: "blue", name: "irigation" },
  { color: "green", name: "harvest" },
  { color: "orange", name: "amendments" },
  { color: "violet", name: "seeding" },
  { color: "yellow", name: "weed contor" },
];
interface Props {
  /**
   * URL for the Hylo iframe box
   */
  iframeSrc: string;
}

export const Dashboard = ({ iframeSrc }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [plantingCards, setPlantingCards] = useState([
    createFakePlantingCardData("72", schemeTableau10[4]),
    createFakePlantingCardData("67", schemeTableau10[0]),
  ]);
  const rightSide = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowWidth();
  const scrollY = useScrollPosition();

  const [rightRect, setRightRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    if (rightSide.current) {
      setRightRect(rightSide.current.getBoundingClientRect());
    }
  }, [rightSide.current, windowWidth, scrollY]);

  const handleClickRowData = useCallback(
    (data: PlantingData, color: string) => {
      setPlantingCards(
        uniq([createFakePlantingCardData(data.id, color), ...plantingCards])
      );
    },
    [plantingCards]
  );

  const handleCloseCard = useCallback(
    (cardId: string) => {
      setPlantingCards(plantingCards.filter((card) => card.id !== cardId));
    },
    [plantingCards]
  );

  const pages = [
    {
      label: "Compare",
      renderPanel: () => <RandomContent onClickData={handleClickRowData} />,
    },
    {
      label: "My Data",
      renderPanel: () => <RandomContent onClickData={handleClickRowData} />,
    },
  ];

  return (
    <Root>
      <Header>
        <img
          css={css`
            height: 92%;
            width: auto;
            align-self: center;
          `}
          src={logoImage}
          width="180"
        />
      </Header>
      <Tabs
        css={css`
          grid-area: values;
          /* header_height - tabs-height */
          margin-top: 30px;
        `}
        pages={pages}
        index={tabIndex}
        onChange={setTabIndex}
      />
      <RightSide ref={rightSide}>
        <Events>
          {/* <Legend entries={legendEntries} /> */}
          {plantingCards.map((props) => (
            <EventsCard
              {...props}
              key={props.id}
              onClose={() => handleCloseCard(props.id)}
            />
          ))}
        </Events>
        {rightRect ? <HyloBox rect={rightRect} src={iframeSrc} /> : null}
      </RightSide>
    </Root>
  );
};

export const App = (props: ComponentProps<typeof Dashboard>) => (
  <HoveredPlantingProvider>
    <Dashboard {...props}/>
  </HoveredPlantingProvider>
);
