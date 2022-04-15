/** @jsxImportSource @emotion/react */

import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";
import { IconEventsBar, FarmEvent } from "./IconEventsBar";
import CloseIcon from "@mui/icons-material/Close";
import { useHoveredPlantingContext } from "../contexts/HoveredPlantingContext";
import tinycolor from "tinycolor2";
import { useFiltersContext } from "../contexts/FiltersContext";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import PublicIcon from "@mui/icons-material/Public";
import { Tip } from "grommet";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { useEventsCardQuery } from "./EventsCard.generated";

export const defaultTheme = {
  sidePad: 10,
  colorBorderWidth: 15,
  colorBorderHighlightWidth: 20,
  hoverExtraWidth: 0,
  parametersFontSize: 12,
};

const Root = withTheme(styled.div<{
  color: string;
  isHighlighted: boolean;
  hideColorBorder: boolean;
}>`
  ${(p) =>
    p.hideColorBorder
      ? ""
      : `border-right: ${
          p.isHighlighted
            ? p.theme.eventsCard.colorBorderHighlightWidth
            : p.theme.eventsCard.colorBorderWidth
        }px solid ${p.isHighlighted ? "white" : p.theme.color(p.color)};`}
  background-color: ${(p) =>
    p.isHighlighted
      ? tinycolor(p.theme.colors.bgSidePanel).lighten(10).toString()
      : p.theme.colors.bgSidePanel};
  width: ${(p) =>
    p.isHighlighted
      ? `calc(100% + ${p.theme.eventsCard.hoverExtraWidth}px)`
      : "100%"};
  transition: all 0.1s ease-out;
  margin-bottom: 20px;
`);

const Head = withTheme(styled.div`
  display: flex;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  justify-content: space-between;
  font-size: 19px;
  padding: 7px ${(p) => p.theme.eventsCard.sidePad}px 2px;
`);

const Title = withTheme(styled.div`
  font-family: ${(p) => p.theme.font};
  color: white;
`);

const Name = withTheme(styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  font-family: ${(p) => p.theme.font};
  font-weight: 600;
  color: white;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`);

const Params = withTheme(styled.div`
  display: flex;
  padding: 1px 10px;
  font-size: ${(p) => p.theme.eventsCard.parametersFontSize}px;
`);
const ParamValue = withTheme(styled.div`
  font-family: ${(p) => p.theme.font};
  font-weight: 600;
  color: ${(p) => p.theme.colors.secondary};
`);
export const Spacer = withTheme(styled.div`
  flex-grow: 1;
`);

const IconButton = styled.div`
  color: white;
  cursor: pointer;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  margin-left: 10px;
`;

const MiniInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

type Parameters = {
  zone: string;
  temperature: string;
  precipitation: string;
  texture: string;
};
interface Props {
  plantingId: string;
  // color?: string;
  // events?: FarmEvent[];
  // params: Parameters;
  // title?: string;
  // name?: string;
  onClose?: () => void;
  hideColorBorder?: boolean;
}

export const EventsCard = ({
  plantingId,
  // color = "white",
  // events = [],
  // params,
  // title = "2020 Corn",
  // name = "My Farm",
  hideColorBorder = false,
  onClose,
}: Props) => {
  const { data: { planting } = {} } = useEventsCardQuery({
    variables: { plantingId },
  });
  console.log({planting})
  if (!planting) {
    return null;
  }
  const [hoveredPlanting, setHoveredPlanting] = useHoveredPlantingContext();
  const [_, dispatchFilters] = useFiltersContext();
  const onHoverData = useCallback(
    () => setHoveredPlanting({ type: "hover", planting: planting.id }),
    [planting.id]
  );
  const onLeaveData = useCallback(
    () => setHoveredPlanting({ type: "leave", planting: planting.id }),
    [planting.id]
  );
  const isHighlighted = hoveredPlanting === planting.id;
  return (
    <Root
      color={"grey"} //TODO read color from matching filters
      isHighlighted={isHighlighted}
      onMouseEnter={onHoverData}
      onMouseLeave={onLeaveData}
      hideColorBorder={hideColorBorder}
    >
      <Head>
        <Title>{planting.title}</Title>
        <Spacer />
        <Tip content="Producer profile">
          <Name
            onClick={() =>
              dispatchFilters({
                type: "selectFarmer",
                farmerId: planting.producerName,
              })
            }
          >
            <ContactPageIcon fontSize="inherit" />
            {planting.producerName}
          </Name>
        </Tip>

        {onClose ? (
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="inherit" onClick={onClose} color="inherit" />
          </IconButton>
        ) : null}
      </Head>

      <Params>
        <MiniInfo>
          <ThermostatIcon fontSize="inherit" />
          <ParamValue>{planting.params.temperature}</ParamValue>
        </MiniInfo>
        <MiniInfo>
          <InvertColorsIcon fontSize="inherit" />
          <ParamValue>{planting.params.precipitation}</ParamValue>
        </MiniInfo>
        <MiniInfo>
          <PublicIcon fontSize="inherit" />
          <ParamValue>{planting.params.zone}</ParamValue>
        </MiniInfo>
        <Spacer />
        <ParamValue>{planting.params.texture}</ParamValue>
      </Params>
      <IconEventsBar
        events={planting.events.map(({ date, ...e }) => ({
          ...e,
          date: new Date(date),
        }))}
      />
    </Root>
  );
};
