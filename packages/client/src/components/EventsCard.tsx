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
import {
  useHighlightedPlantingId,
  useHighlightPlanting,
  useUnhighlightPlanting,
} from "../states/highlightedPlantingId";
import {
  useRemovePlantingCard,
  useShowProfile,
} from "../states/sidePanelContent";
import { LinearProgress } from "@mui/material";
import { isNil } from "lodash";

export const defaultTheme = {
  sidePad: 10,
  colorBorderWidth: 15,
  colorBorderHighlightWidth: 20,
  hoverExtraWidth: 0,
  parametersFontSize: 12,
  colorBorderStrideWidth: 12,
  colorBorderStrideAngle: -34,
};

const Root = withTheme(styled.div<{
  isHighlighted: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  background-color: ${(p) =>
    p.isHighlighted
      ? tinycolor(p.theme.colors.bgSidePanel).lighten(10).toString()
      : p.theme.colors.bgSidePanel};
  width: ${(p) =>
    p.isHighlighted
      ? `calc(100% + ${p.theme.eventsCard.hoverExtraWidth}px)`
      : "100%"};
  margin-bottom: 20px;
  min-height: 70px;
`);

const ColorBorder = withTheme(styled.div<{
  colors: string[];
  isHighlighted: boolean;
}>`
  flex: 0;
  flex-basis: ${(p) =>
    p.isHighlighted
      ? p.theme.eventsCard.colorBorderHighlightWidth
      : p.theme.eventsCard.colorBorderWidth}px;
  background: ${(p) =>
    p.isHighlighted
      ? "white"
      : `repeating-linear-gradient(
      ${p.theme.eventsCard.colorBorderStrideAngle}deg,
      ${p.colors
        .map((color, i) => [
          `${color} ${i * p.theme.eventsCard.colorBorderStrideWidth}px`,
          `${color} ${(i + 1) * p.theme.eventsCard.colorBorderStrideWidth - 2}px`,
          `${p.colors[(i+1)%p.colors.length]} ${(i + 1) * p.theme.eventsCard.colorBorderStrideWidth}px`,
        ])
        .flat()
        .join(",")}
    )`};

  transition: all 0.1s ease-out;
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
  minEventDate?: Date;
  maxEventDate?: Date;
  colors?: string[];
}

export const EventsCard = ({
  plantingId,
  hideName = false,
  hideColorBorder = false,
  minEventDate,
  maxEventDate,
  colors,
}: Props) => {
  const highlightedPlantingId = useHighlightedPlantingId();
  const unhighlightPlanting = useUnhighlightPlanting();
  const highlightPlanting = useHighlightPlanting();
  const removePlantingCard = useRemovePlantingCard();
  const showProfile = useShowProfile();
  const { data: { planting } = {} } = useEventsCardQuery({
    variables: { plantingId },
  });
  const { averageAnnualTemperature, averageAnnualRainfall, climateZone } =
    planting?.farmOnboarding || {};
  const texture = useMemo(() => {
    const { sandPercentage, clayPercentage } = planting?.params || {};
    const sand = isNil(sandPercentage) ? null : `Sand ${sandPercentage}%`;
    const clay = isNil(clayPercentage) ? null : `Clay ${clayPercentage}%`;
    return [sand, clay].filter(Boolean).join(" | ");
  }, [planting?.params.sandPercentage, planting?.params.clayPercentage]);

  const onClose = useCallback(
    () => planting && removePlantingCard(planting.id),
    [planting?.id]
  );
  const onHoverData = useCallback(
    () => planting && highlightPlanting(planting.id),
    [planting?.id]
  );
  const onLeaveData = useCallback(
    () => planting && unhighlightPlanting(planting.id),
    [planting?.id]
  );
  const isHighlighted = useMemo(
    () => planting?.id === highlightedPlantingId,
    [planting?.id, highlightedPlantingId]
  );

  return (
    <Root
      isHighlighted={isHighlighted}
      onMouseEnter={onHoverData}
      onMouseLeave={onLeaveData}
    >
      <div style={{ flex: 1 }}>
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
                  {isNil(averageAnnualTemperature)
                    ? "n/a"
                    : `${averageAnnualTemperature}℃`}
                </ParamValue>
              </MiniInfo>
              <MiniInfo>
                <InvertColorsIcon fontSize="inherit" />
                <ParamValue>
                  {isNil(averageAnnualRainfall)
                    ? "n/a"
                    : `${averageAnnualRainfall}%`}
                </ParamValue>
              </MiniInfo>
              <MiniInfo>
                <PublicIcon fontSize="inherit" />
                <ParamValue>
                  {isNil(climateZone) ? "n/a" : climateZone}
                </ParamValue>
              </MiniInfo>
              <Spacer />
              <ParamValue>{texture}</ParamValue>
            </Params>
            <IconEventsBar
              minEventDate={minEventDate}
              maxEventDate={maxEventDate}
              events={planting.events}
            />
          </>
        )}
      </div>
      {hideColorBorder ? null : (
        <ColorBorder
          colors={colors || ["grey"]}
          isHighlighted={isHighlighted}
        />
      )}
    </Root>
  );
};
