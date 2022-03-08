/** @jsxImportSource @emotion/react */

import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import "../index.css";
import { IconEventsBar, FarmEvent } from "./IconEventsBar";
import CloseIcon from "@mui/icons-material/Close";
import { useHoveredPlantingContext } from "../contexts/HoveredPlantingContext";
import tinycolor from "tinycolor2";

export const defaultTheme = {
  sidePad: 10,
  colorBorderWidth: 15,
  colorBorderHighlightWidth: 20,
  hoverExtraWidth: 0,
};

const Root = withTheme(styled.div<{ color: string; isHighlighted: boolean }>`
  border-right: ${(p) =>
      p.isHighlighted
        ? p.theme.eventsCard.colorBorderHighlightWidth
        : p.theme.eventsCard.colorBorderWidth}px
    solid ${(p) => (p.isHighlighted ? "white" : p.theme.color(p.color))};
  background-color: ${(p) =>
    p.isHighlighted
      ? tinycolor(p.theme.colors.bgSidePanel).lighten(10).toString()
      : p.theme.colors.bgSidePanel};
  width: ${(p) =>
    p.isHighlighted
      ? `calc(100% + ${p.theme.eventsCard.hoverExtraWidth}px)`
      : '100%'};
  transition: all 0.1s ease-out;
`);

const Head = withTheme(styled.div`
  display: flex;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  justify-content: space-between;
  font-size: 19px;
  padding: 7px ${p => p.theme.eventsCard.sidePad}px 2px;
`);

const Title = withTheme(styled.div`
  font-family: ${(p) => p.theme.fonts.base};
  color: white;
`);

const Name = withTheme(styled.div`
  font-family: ${(p) => p.theme.fonts.baseBold};
  color: white;
`);

const Params = withTheme(styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  column-gap: 10px;
  row-gap: 11px;
  padding: 11px ${p => p.theme.eventsCard.sidePad}px;
  font-size: 11.4px;
`);
const ParamName = withTheme(styled.div`
  font-family: ${(p) => p.theme.fonts.baseBold};
  color: white;
  text-transform: uppercase;
  justify-self: end;
`);
const ParamValue = withTheme(styled.div`
  font-family: ${(p) => p.theme.fonts.baseBold};
  color: ${(p) => p.theme.colors.primary};
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
  id: string;
  color?: string;
  events?: FarmEvent[];
  params: { [index: string]: string };
  title?: string;
  name?: string;
  onClose?: () => void;
}

export const EventsCard = ({
  id,
  color = "white",
  events = [],
  params = {},
  title = "2020 Corn",
  name = "My Farm",
  onClose,
}: Props) => {
  const [hoveredPlanting, setHoveredPlanting] = useHoveredPlantingContext();
  const onHoverData = useCallback(
    () => setHoveredPlanting({ type: "hover", planting: id }),
    []
  );
  const onLeaveData = useCallback(
    () => setHoveredPlanting({ type: "leave", planting: id }),
    []
  );
  const isHighlighted = hoveredPlanting === id;
  return (
    <Root color={color} isHighlighted={isHighlighted} onMouseEnter={onHoverData} onMouseLeave={onLeaveData}>
      <Head>
        <Title>{title}</Title>
        <div
          css={css`
            flex-grow: 1;
          `}
        />
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
