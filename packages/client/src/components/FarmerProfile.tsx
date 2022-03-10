/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

import profileImage from "../assets/images/male-placeholder-image.jpeg";

import "../index.css";
import { css, withTheme } from "@emotion/react";
import { Box } from "grommet";
import { Spacer } from "./EventsCard";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "./FilterEditor";
import { useCallback } from "react";
import { useFiltersContext } from "../contexts/FiltersContext";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  display: flex;
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
        <Box direction="column"  flex={{grow: 1}} justify="start">
          <Box direction="row" align="center">
            <Name>{name}</Name>
            <Spacer />
            <IconButton onClick={handleClose} css={css`font-size: 19px`}>
              <CloseIcon fontSize="inherit" color="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {LOREM}
    </Root>
  );
};
