import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import bgImage from "../assets/images/Background-corngrains.jpg";
import { Tabs } from "../components/Tabs";
import { ValueDistribution } from "../components/ValueDistribution";
import { withTheme } from "@emotion/react";
import { genDataPoints } from '../utils/random'

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px;
`

const RowGroupHead = withTheme(styled.div`
  color: white;
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: 18px;
`)

const RandomContent = () => {
  return (
    <RowContainer>
      <RowGroupHead>Indicators</RowGroupHead>
      <ValueDistribution label="soil carbon" values={genDataPoints('soil arbon')} />
      <ValueDistribution label="infiltration" values={genDataPoints('infiltration')} />
      <ValueDistribution label="biodiversity" values={genDataPoints('biodiversity')} />
      <RowGroupHead>Goals</RowGroupHead>
      <ValueDistribution label="profitability" values={genDataPoints('profitability')} />
      <ValueDistribution label="risk reduction" values={genDataPoints('risk reduction')} />
      <ValueDistribution label="crop quality" values={genDataPoints('crop quality')} />
    </RowContainer>
  )
}

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
      <Tabs pages={pages} index={tabIndex} onChange={setTabIndex}/>
    </Root>
  );
};
