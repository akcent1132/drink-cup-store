import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import bgImage from "../assets/images/Background-corngrains.jpg";
import { Tabs } from "../components/Tabs";
import { ValueDistribution } from "../components/ValueDistribution";
import { withTheme } from "@emotion/react";
import { genDataPoints } from "../utils/random";
import { Button } from "../components/Button";
import faker from "faker";
import { sample, without } from "lodash";
import { group } from "console";

// TODO read height from props

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${bgImage});
  background-size: cover;
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
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px;
`;

const RowGroupHead = withTheme(styled.div`
  color: white;
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: 18px;
`);

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
  Goals: ["profitability", "risk reduction", "crop quality"],
};

const RandomContent = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const addGroup = useCallback(() => {
    const freeColors = without(COLORS, ...groups.map((g) => g.color)) || COLORS;
    setGroups([
      ...groups,
      {
        name: faker.company.companyName(),
        color: sample(freeColors)!,
      },
    ]);
  }, [groups]);
  const removeGroup = useCallback(
    (name: string) => {
      setGroups(groups.filter((g) => g.name !== name));
    },
    [groups]
  );

  return (
    <RowContainer>
      <PaneHead>
        {groups.reverse().map((group) => (
          <Button
            label={group.name}
            color={group.color}
            onClick={() => removeGroup(group.name)}
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
              { color: 'grey', values: genDataPoints(row, 80, 10)},
              ...groups.map(({ color, name }) => ({
                color,
                values: genDataPoints(row + name, 32),
              }))
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
      <Tabs pages={pages} index={tabIndex} onChange={setTabIndex} />
    </Root>
  );
};
