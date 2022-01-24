/** @jsxImportSource @emotion/react */

import React, { useCallback, useEffect, useReducer, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import bgImage from "../assets/images/Background-corngrains.jpg";
import logoImage from "../assets/images/Farmers-coffeeshop-logo-white_transparent.png";
import { Tabs } from "../components/Tabs";
import { ValueDistribution } from "../components/ValueDistribution";
import { css, withTheme } from "@emotion/react";
import { genDataPoints } from "../utils/random";
import { Button } from "../components/Button";
import { EventsCard } from "../components/EventsCard";
import { Legend } from "../components/Legend";
import faker from "faker";
import { sample, without } from "lodash";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// TODO read height from props

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 32px;
  padding-left: 52px;
  box-sizing: border-box;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 4) 0%,
      rgba(0, 0, 0, 0.34) 10%
    ),
    url(${bgImage});
  background-size: cover;
  display: grid;
  grid-template-columns: 1fr max(500px, 34%);
  grid-template-rows: auto;
  grid-template-areas: "values events";
  & > * {
    overflow: hidden;
    max-width: 100%;
  }
`;

interface Props {
  /**
   * Data name
   */
  label: string;
}

const PaneHead = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 50px 50px 4px;
`;

const RowGroup: React.FC<{
  name: string;
  isAccordion?: boolean;
  sub?: boolean;
}> = ({ children, name, isAccordion, sub }) => {
  const [open, setOpen] = useState(true);
  const Icon = open ? ExpandMoreIcon : ChevronRightIcon;
  return (
    <>
      <div
        css={css`
          display: flex;
          margin: ${sub ? "10px 0 0px" : "14px 0 8px"};
        `}
        onClick={() => setOpen(!open)}
      >
        {children && isAccordion ? (
          <Icon sx={{ color: "white", fontSize: sub ? "15px" : "15px" }} />
        ) : null}
        <RowGroupText sub={sub}>{name}</RowGroupText>
      </div>
      {open ? children : null}
    </>
  );
};

const RowGroupText = withTheme(styled.div<{ sub?: boolean }>`
  color: white;
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: ${(props) => (props.sub ? 14 : 18)}px;
`);

const RightSide = styled.div`
  grid-area: events;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 40px 20px;
`;

const Events = styled.div`
  display: flex;
  padding: 10px 40px 50px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
`;

const FarmerName = withTheme(styled.div`
  font-family: ${(props) => props.theme.fonts.baseBold};
  padding: 0 29px;
  line-height: 5px;
  font-size: 19px;
  color: white;
`);

const COLORS = [
  "purple",
  "blue",
  "teal",
  "green",
  "olive",
  "yellow",
  "orange",
  // "red",
  "violet",
];

const ROWS: RowData[] = [
  {
    name: "Indicators	",
    type: "group",
    children: [
      {
        name: "Profitability	",
        type: "sub-group",
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

type RowData = { name: string; type: string; children?: RowData[] };

const NestedRows = ({
  rows,
  groups,
  hoverState,
}: {
  rows: RowData[];
  hoverState: string | null;
  groups: Group[];
}) => (
  <React.Fragment>
    {rows.map(({ name, type, children = [] }, i) =>
      type === "group" || type === "sub-group" ? (
        <RowGroup
          key={i}
          name={name}
          sub={type === "sub-group"}
          isAccordion
        >
          {/* @ts-ignore */}
          <NestedRows rows={children} groups={groups} hoverState={hoverState} />
        </RowGroup>
      ) : (
        <ValueDistribution
          key={i}
          label={name}
          values={[
            { color: "grey", values: genDataPoints(name, 80, 10) },
            ...groups.map(({ color, name: orgName }) => ({
              color,
              values: genDataPoints(name + orgName, 32),
              showVariance: true,
              isHighlighted: hoverState === name,
            })),
          ]}
          css={css`
            margin: 4px 0;
          `}
        />
      )
    )}
  </React.Fragment>
);

const RandomContent = () => {
  const [hoverState, hoverDispatch] = useReducer(hoverReducer, null);
  const [groups, setGroups] = useState<Group[]>([]);

  const addGroup = useCallback((color?: string) => {
    const freeColors = without(COLORS, ...groups.map((g) => g.color)) || COLORS;
    const group = {
      name: faker.company.companyName(),
      color: color || sample(freeColors)!,
    };
    console.log("setGroups([...groups, group]);");
    setGroups([...groups, group]);
    return group;
  }, [groups]);
  const removeGroup = useCallback(
    (name: string) => {
      console.log("setGroups(groups.filter((g) => g.name !== name));");
      setGroups(groups.filter((g) => g.name !== name));
    },
    [groups]
  );

  useEffect(() => {
    setGroups([addGroup('olive'), addGroup('orange')]);
  }, []);

  return (
    <RowContainer>
      <PaneHead>
        {[...groups].reverse().map((group, i) => (
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
          color="darkTransparent"
          onClick={() => addGroup()}
        />
      </PaneHead>
      <NestedRows rows={ROWS} groups={groups} hoverState={hoverState} />
    </RowContainer>
  );
};

type Group = {
  color: string;
  name: string;
};

const fakeEventCardData = [
  {
    color: "teal",
    params: {
      zone: "8b",
      temperature: "65",
      precipitation: "47 in",
      texture: "Sand: 38% | Slit 41% | Clay 21%",
    },
    events: [
      { color: "violet", date: new Date("Thu May 3 2022") },
      { color: "blue", date: new Date("Thu Jun 10 2022") },
      { color: "yellow", date: new Date("Thu Jun 27 2022") },
      { color: "blue", date: new Date("Thu Jul 08 2022") },
      { color: "green", date: new Date("Thu Jul 29 2022") },
      { color: "red", date: new Date("Thu Oct 12 2022") },
    ],
  },
  {
    color: "orange",
    params: {
      zone: "8b",
      temperature: "65",
      precipitation: "47 in",
      texture: "Sand: 38% | Slit 41% | Clay 21%",
    },
    events: [
      { color: "violet", date: new Date("Thu May 12 2022") },
      { color: "blue", date: new Date("Thu Jun 14 2022") },
      { color: "yellow", date: new Date("Thu Jun 22 2022") },
      { color: "blue", date: new Date("Thu Jul 05 2022") },
      { color: "green", date: new Date("Thu Aug 4 2022") },
      { color: "red", date: new Date("Thu Sep 30 2022") },
    ],
  },
];

const legendEntries = [
  { color: "red", name: "tillage" },
  { color: "blue", name: "irigation" },
  { color: "green", name: "harvest" },
  { color: "orange", name: "amendments" },
  { color: "violet", name: "seeding" },
  { color: "yellow", name: "weed contor" },
];

/**
 * Primary UI component for user interaction
 */
export const Dashboard = ({ label }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);

  const pages = [
    { label: "Compare", renderPanel: () => <RandomContent /> },
    { label: "My Data", renderPanel: () => <RandomContent /> },
  ];
  return (
    <Root>
      <Tabs
        css={css`
          grid-area: values;
        `}
        pages={pages}
        index={tabIndex}
        onChange={setTabIndex}
      />
      <RightSide>
        <RightHeader>
          <img src={logoImage} width="180" />
        </RightHeader>
        <Events>
          <FarmerName>Individual farmer</FarmerName>
          <Legend entries={legendEntries} />
          {fakeEventCardData.map((props, i) => (
            <EventsCard {...props} key={i} />
          ))}
        </Events>
      </RightSide>
    </Root>
  );
};
