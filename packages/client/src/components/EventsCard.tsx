/** @jsxImportSource @emotion/react */

import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import "../index.css";
import { IconEventsBar, FarmEvent } from "./IconEventsBar";
import CloseIcon from "@mui/icons-material/Close";

const SIDE_PAD = 10;

const Root = withTheme(styled.div<{ color: string }>`
  border-right: 20px solid ${(props) => props.theme.color(props.color)};
  background-color: ${(props) => props.theme.colors.bgSidePanel};
`);

const Head = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
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

const IconButton = withTheme(styled.div`
  color: white;
  cursor: pointer;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  margin-left: 10px;
`);

interface Props {
  color?: string;
  events?: FarmEvent[];
  params: { [index: string]: string };
  title?: string;
  name?: string;
  onClose?: () => void;
}

export const EventsCard = ({
  color = "white",
  events = [],
  params = {},
  title = "2020 Corn",
  name = "My Farm",
  onClose,
}: Props) => {
  return (
    <Root color={color}>
      <Head>
        <Title>{title}</Title>
        <div css={css`flex-grow: 1`}/>
        <Name>{name}</Name>
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="inherit" onClick={onClose} color="inherit" />
        </IconButton>
      </Head>
      <Params>
        {Object.entries(params).map(([key, value]) => [
          <ParamName key={`name-${key}`}>{key}</ParamName>,
          <ParamValue key={`value-${key}`}>{value}</ParamValue>,
        ])}
      </Params>
      <IconEventsBar events={events} />
    </Root>
  );
};
