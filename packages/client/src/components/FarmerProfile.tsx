/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import "../index.css";
import { css, withTheme } from "@emotion/react";
import { Box, Button } from "grommet";
import { EventsCard, Spacer } from "./EventsCard";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "./filterEditor/FilterEditor";
import { useCallback, useMemo, useState } from "react";
import { sortBy, take } from "lodash";
import { Tabs } from "./Tabs";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import useCopy from "use-copy";
import { useFarmerProfileQuery } from "./FarmerProfile.generated";
import { useShowPlantingCards } from "../states/sidePanelContent";
import LinearProgress from "@mui/material/LinearProgress";

const LS_SHOW_PRODUCER_NAME = "show-producer-name";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.darkTransparent};
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding-bottom: 70px;
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

const EMAIL = "684c9b3930413fdab7c6425ec01c878d@comm.surveystack.org";
type Props = { producerId: string };
export const FarmerProfile = ({ producerId }: Props) => {
  const { data: { producer } = {} } = useFarmerProfileQuery({
    variables: { producerId },
  });
  const showPlantingCards = useShowPlantingCards();
  const [tabIndex, setTabIndex] = useState(0);

  const [copied, copy, setCopied] = useCopy(EMAIL);

  const copyData = useCallback(() => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copy, setCopied]);

  const handleClose = useCallback(() => showPlantingCards(), []);

  return (
    <Root>
      {!producer ? (
        <LinearProgress />
      ) : (
        <>
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
                  <Name>
                    {localStorage[LS_SHOW_PRODUCER_NAME] === "true"
                      ? producer.id
                      : producer.code}
                  </Name>
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
                    {take(
                      sortBy(
                        producer.plantings,
                        (p) => p.events.length
                      ).reverse(),
                      5
                    ).map((p) => (
                      <EventsCard
                        key={p.id}
                        plantingId={p.id}
                        hideName
                        hideColorBorder
                      />
                    ))}
                  </CardContainer>
                ),
              },
              {
                label: "Fields",
                renderPanel: () => (
                  <CardContainer>
                    {producer.plantings.map((p) => (
                      <EventsCard
                        key={p.id}
                        plantingId={p.id}
                        hideName
                        hideColorBorder
                      />
                    ))}
                  </CardContainer>
                ),
              },
            ]}
            index={tabIndex}
            onChange={setTabIndex}
          />
        </>
      )}
    </Root>
  );
};
