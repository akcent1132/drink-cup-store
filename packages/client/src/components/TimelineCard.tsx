import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";

const SIDE_PAD = 10;

const Root = withTheme(styled.div<{ color: string }>`
  border-left: 20px solid ${(props) => props.theme.color(props.color)};
  background-color: ${(props) => props.theme.colors.darkTransparent};
  margin-top: 300px;
`);

const Head = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(255,255,255,0.5);
  justify-content: space-between;
  font-size: 19px;
  padding: 7px ${SIDE_PAD}px 2px;
`;

const Title = withTheme(styled.div`
  font-family: ${(props) => props.theme.fonts.base};
  color: white;
`);

const Name = withTheme(styled.div`
  font-family: ${(props) => props.theme.fonts.baseBold};
  color: white;
`);

const Params = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  column-gap: 10px;
  row-gap: 11px;
  padding: 11px ${SIDE_PAD}px;
  font-size: 11.4px;
`;
const ParamName = withTheme(styled.div`
  font-family: ${(props) => props.theme.fonts.baseBold};
  color: white;
  text-transform: uppercase;
  justify-self: end;
`);
const ParamValue = withTheme(styled.div`
  font-family: ${(props) => props.theme.fonts.baseBold};
  color: #fff683;
  justify-self: start;
`);

type Event = {
  color: string;
  date: Date;
};

interface Props {
  color?: string;
  events?: Event[];
  params: { [key: string]: string };
}

/**
 * TimelineCard component
 */
export const TimelineCard = ({
  color = "white",
  events = [],
  params = {},
}: Props) => {
  return (
    <Root color={color}>
      <Head>
        <Title>2020 Corn</Title>
        <Name>Farmer Pete</Name>
      </Head>
      <Params>
        {Object.entries(params).map(([key, value]) => [
          <ParamName>{key}</ParamName>,
          <ParamValue>{value}</ParamValue>,
        ])}
      </Params>
    </Root>
  );
};
