/** @jsxImportSource @emotion/react */

import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";
import { IconEventsBar } from "./IconEventsBar";
import CloseIcon from "@mui/icons-material/Close";
import tinycolor from "tinycolor2";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import PublicIcon from "@mui/icons-material/Public";
import { Tip } from "grommet";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { useEventsCardQuery } from "./EventsCard.generated";
import { useHightlightedPlantingId } from "../states/highlightedPlantingId";
import {
  useRemovePlantingCard,
  useShowProfile,
} from "../states/sidePanelContent";
import { LinearProgress } from "@mui/material";

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
  min-height: 70px;
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

interface Props {
  plantingId: string;
  hideName?: boolean;
  hideColorBorder?: boolean;
}

export const EventsCard = ({
  plantingId,
  hideName = false,
  hideColorBorder = false,
}: Props) => {
  const { hightlightPlanting, unhightlightPlanting, highlightedPlantingId } =
    useHightlightedPlantingId();
  const removePlantingCard = useRemovePlantingCard();
  const showProfile = useShowProfile();
  const { data: { planting } = {} } = useEventsCardQuery({
    variables: { plantingId },
  });
  const texture = useMemo(
    () =>
      [planting?.params.sandPercentage, planting?.params.clayPercentage]
        .map((p) => `${p}%`)
        .join(" | "),
    [planting?.params.sandPercentage, planting?.params.clayPercentage]
  );

  const onClose = useCallback(
    () => planting && removePlantingCard(planting.id),
    [planting?.id]
  );
  const onHoverData = useCallback(
    () => planting && hightlightPlanting(planting.id),
    [planting?.id]
  );
  const onLeaveData = useCallback(
    () => planting && unhightlightPlanting(planting.id),
    [planting?.id]
  );

  return (
    <Root
      color={"grey"}
      isHighlighted={planting?.id === highlightedPlantingId}
      onMouseEnter={onHoverData}
      onMouseLeave={onLeaveData}
      hideColorBorder={hideColorBorder}
    >
      {!planting ? (
        <LinearProgress />
      ) : (
        <>
          <Head>
            <Title>{planting.title}</Title>
            <Spacer />
            {!hideName ? (
              <Tip content="Producer profile">
                <Name onClick={() => showProfile(planting.producer.id)}>
                  <ContactPageIcon fontSize="inherit" />
                  {planting.producer.code}
                </Name>
              </Tip>
            ) : null}

            {onClose ? (
              <IconButton onClick={onClose}>
                <CloseIcon
                  fontSize="inherit"
                  onClick={onClose}
                  color="inherit"
                />
              </IconButton>
            ) : null}
          </Head>

          <Params>
            <MiniInfo>
              <ThermostatIcon fontSize="inherit" />
              <ParamValue>
                {planting.farmOnboarding?.averageAnnualTemperature || "n/a"}
              </ParamValue>
            </MiniInfo>
            <MiniInfo>
              <InvertColorsIcon fontSize="inherit" />
              <ParamValue>
                {planting.farmOnboarding?.averageAnnualRainfall || "n/a"}
              </ParamValue>
            </MiniInfo>
            <MiniInfo>
              <PublicIcon fontSize="inherit" />
              <ParamValue>
                {planting.farmOnboarding?.climateZone || "n/a"}
              </ParamValue>
            </MiniInfo>
            <Spacer />
            <ParamValue>{texture}</ParamValue>
          </Params>
          <IconEventsBar events={planting.events} />
        </>
      )}
    </Root>
  );
};
