/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

import profileImage from "../assets/images/male-placeholder-image.jpeg";

import "../index.css";
import { css, withTheme } from "@emotion/react";
import { Box, Button } from "grommet";
import { Spacer } from "./EventsCard";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Label } from "./FilterEditor";
import { useCallback, useMemo } from "react";
import { useFiltersContext } from "../contexts/FiltersContext";
import { range } from "lodash";
import { createFakePlantingCardData } from "../stories/Dashboard";
import { IconEventsBar } from "./IconEventsBar";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  display: flex;
  gap: 16px;
  flex-direction: column;
`);

const Name = withTheme(styled.div`
  display: flex;
  font-family: ${(p) => p.theme.font};
  font-size: 19px;
  padding: 8px 14px;
  font-weight: 600;
  color: white;
`);

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non congue ex, ac tempus eros. Pellentesque varius finibus velit, in auctor sem tristique eu. Sed blandit luctus blandit. In sollicitudin malesuada ullamcorper. Pellentesque porttitor, lectus id auctor fermentum, leo neque pulvinar ipsum, vel sagittis ipsum eros non nisi.";

type Props = { name: string };
export const FarmerProfile = ({ name }: Props) => {
  const [_, dispatchFilters] = useFiltersContext();

  const handleClose = useCallback(
    () => dispatchFilters({ type: "selectFarmer", farmerId: null }),
    []
  );

  const plantings = useMemo(
    () => range(3).map((id) => createFakePlantingCardData(id.toString(), "")),
    []
  );
  return (
    <Root>
      <Box direction="row">
        <img
          css={css`
            align-self: center;
          `}
          src={profileImage}
          width="180px"
        />
        <Box direction="column" flex={{ grow: 1 }} justify="start">
          <Box direction="row" align="center" css={css`padding-right: 12px`}>
            <Name>{name}</Name>
            <Spacer />
            <IconButton
              onClick={handleClose}
              css={css`
                font-size: 19px;
              `}
            >
              <CloseIcon fontSize="inherit" color="inherit" />
            </IconButton>
          </Box>
          <Spacer/>
          <Box align="end" css={css`padding: 0 12px;`}><Button color="rgb(13, 195, 159)" primary label="Message on Hylo" /></Box>
        </Box>
      </Box>
      {LOREM}
      <Name>Plantings</Name>
      {plantings.map((p) => (
        <Box gap="2px">
          <Label label={p.title} />
          <IconEventsBar events={p.events} />
        </Box>
      ))}
    </Root>
  );
};
