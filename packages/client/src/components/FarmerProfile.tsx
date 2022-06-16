/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import "../index.css";
import { css, withTheme } from "@emotion/react";
import { Box, Button } from "grommet";
import { EventsCard, Spacer } from "./EventsCard";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "./FilterEditor";
import { useCallback, useMemo, useState } from "react";
import { selectProducer } from "../contexts/FiltersContext";
import { range } from "lodash";
import { createFakePlantingCardData } from "../stories/Dashboard";
import { Tabs } from "./Tabs";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import useCopy from "use-copy";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.darkTransparent};
  display: flex;
  gap: 16px;
  flex-direction: column;
`);

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 14px 0;
  gap: 5px;
`;

const NameLabel = withTheme(styled.div`
  display: flex;
  font-family: ${(p) => p.theme.font};
  font-size: 12px;
  font-weight: 400;
  color: white;
`);

const Name = withTheme(styled.div`
  display: flex;
  font-family: ${(p) => p.theme.font};
  font-size: 24px;
  font-weight: 600;
  color: white;
`);

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non congue ex, ac tempus eros. Pellentesque varius finibus velit, in auctor sem tristique eu. Sed blandit luctus blandit. In sollicitudin malesuada ullamcorper. Pellentesque porttitor, lectus id auctor fermentum, leo neque pulvinar ipsum, vel sagittis ipsum eros non nisi.";

  const EMAIL = "684c9b3930413fdab7c6425ec01c878d@comm.surveystack.org"
type Props = { name: string };
export const FarmerProfile = ({ name }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);

  const [copied, copy, setCopied] = useCopy(EMAIL);

  const copyData = useCallback(() => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copy, setCopied]);

  const handleClose = useCallback(
    () => selectProducer(null),
    []
  );

  const plantings = useMemo(
    () =>
      range(1 + Math.random() * 5).map((id) =>
        createFakePlantingCardData(id.toString(), "")
      ),
    []
  );
  const fields = useMemo(
    () =>
      range(1 + Math.random() * 5).map((id) =>
        createFakePlantingCardData(id.toString(), "")
      ),
    []
  );
  return (
    <Root>
      <Box direction="row">
        <Box direction="column" flex={{ grow: 1 }} justify="start">
          <Box
            direction="row"
            align="center"
            css={css`
              padding-right: 12px;
            `}
          >
            <NameContainer>
              <NameLabel>Producer ID</NameLabel>
              <Name>{name}</Name>
            </NameContainer>
            {/* <Box
              align="end"
              css={css`
                padding: 0 12px;
              `}
            > */}
            <Button
              size="small"
              css={css`
                align-self: flex-end;
                font-weight: bold;
              `}
              // primary
              // color="rgb(13, 195, 159)"
              onClick={copyData}
              label="Contact"
              icon={copied ? <CheckIcon /> : <CopyAllIcon />}
              reverse
            />
            {/* </Box> */}
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
        </Box>
      </Box>
      <Tabs
        css={css`
          grid-area: values;
          /* header_height - tabs-height */
          margin-top: 30px;
        `}
        pages={[
          {
            label: "Plantings",
            renderPanel: () => (
              <CardContainer>
                {plantings.map((p) => (
                  <EventsCard key={p.id} plantingId={p.id} hideName hideColorBorder />
                ))}
              </CardContainer>
            ),
          },
          {
            label: "Fields",
            renderPanel: () => (
              <CardContainer>
                {fields.map((p) => (
                  <EventsCard key={p.id} plantingId={p.id} hideName hideColorBorder />
                ))}
              </CardContainer>
            ),
          },
        ]}
        index={tabIndex}
        onChange={setTabIndex}
      />
    </Root>
  );
};
