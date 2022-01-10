import React, { useCallback, useEffect, useState } from "react";
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
import faker from "faker";
import { sample, without } from "lodash";

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
  gap: 20px;
  padding: 12px 50px 50px 4px;
`;

const RowGroupHead = withTheme(styled.div`
  color: white;
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: 18px;
`);

const RightSide = styled.div`
  grid-area: events;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0 40px 20px;
`;

const Events = styled.div`
  display: flex;
  padding: 0 40px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
`;

const COLORS = [
  "purple",
  "blue",
  "teal",
  "green",
  "olive",
  "yellow",
  "orange",
  "red",
  "violet",
];

const ROWS = {
  Indicators: ["soil carbon", "infiltration", "biodiversity"],
  Goals: [
    "profitability",
    "risk reduction",
    "crop quality",
    "soil structure",
    "soil fertility",
    "soil biology",
    "environment",
  ],
  Practices: ["tillage", "irrigation", "amendments"],
  Soil: ["ponential", "texture"],
  Weather: ["zone", "degree days", "rainfall (in)"],
};

const RandomContent = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const addGroup = useCallback(() => {
    const freeColors = without(COLORS, ...groups.map((g) => g.color)) || COLORS;
    const group = {
      name: faker.company.companyName(),
      color: sample(freeColors)!,
    };
    setGroups([...groups, group]);
    return group;
  }, [groups]);
  const removeGroup = useCallback(
    (name: string) => {
      setGroups(groups.filter((g) => g.name !== name));
    },
    [groups]
  );
  useEffect(() => {
    setGroups([addGroup(), addGroup()]);
  }, []);

  return (
    <RowContainer>
      <PaneHead>
        {groups.reverse().map((group) => (
          <Button
            label={group.name}
            color={group.color}
            onClick={() => removeGroup(group.name)}
            isWide
          />
        ))}
        <Button
          label="+ Add"
          color="darkTransparent"
          onClick={() => addGroup()}
        />
      </PaneHead>
      {Object.entries(ROWS).map(([category, rows]) => [
        <RowGroupHead>{category}</RowGroupHead>,
        ...rows.map((row) => (
          <ValueDistribution
            label={row}
            values={[
              { color: "grey", values: genDataPoints(row, 80, 10) },
              ...groups.map(({ color, name }) => ({
                color,
                values: genDataPoints(row + name, 32),
              })),
            ]}
          />
        )),
      ])}
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
          {fakeEventCardData.map((props, i) => (
            <EventsCard {...props} key={i} />
          ))}
        </Events>
      </RightSide>
    </Root>
  );
};
