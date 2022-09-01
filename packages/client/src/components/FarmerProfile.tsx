/** @jsxImportSource @emotion/react */

import { css, withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { sortBy, take } from "lodash";
import { useCallback, useState } from "react";
import useCopy from "use-copy";
import "../index.css";
import { useShowPlantingCards } from "../states/sidePanelContent";
import { EventsCard, Spacer } from "./EventsCard";
import { useFarmerProfileQuery } from "./FarmerProfile.generated";
import { IconButton } from "./filterEditor/FilterEditor";
import { Tabs } from "./Tabs";

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
  const { producer } =
    useFarmerProfileQuery({
      variables: { producerId },
    })?.data || {};
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
          <Stack direction="row">
            <Stack direction="column" flexGrow={1} justifyItems="start">
              <Stack direction="row" alignItems="center" sx={{ pr: 3 }}>
                <NameContainer>
                  <NameLabel>Producer ID</NameLabel>
                  <Name>
                    {localStorage[LS_SHOW_PRODUCER_NAME] === "true"
                      ? producer.id
                      : producer.code}
                  </Name>
                </NameContainer>

                <Tooltip title={copied ? "Copied" : "Copy Email"}>
                  <Button
                    size="small"
                    onClick={copyData}
                    sx={{ alignSelf: "flex-end" }}
                  >
                    Contact {copied ? <CheckIcon /> : <CopyAllIcon />}
                  </Button>
                </Tooltip>

                <Spacer />
                <IconButton
                  onClick={handleClose}
                  css={css`
                    font-size: 19px;
                  `}
                >
                  <CloseIcon fontSize="inherit" color="inherit" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
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
                        (p) => p.events?.length
                      ).reverse(),
                      5
                    ).map((p) => (
                      <EventsCard
                        key={p.id}
                        planting={p}
                        hideName
                        hideColorBorder
                      />
                    ))}
                  </CardContainer>
                ),
              },
              // {
              //   label: "Fields",
              //   renderPanel: () => (
              //     <CardContainer>
              //       {producer.plantings.map((p) => (
              //         <EventsCard
              //           key={p.id}
              //           plantingId={p.id}
              //           hideName
              //           hideColorBorder
              //         />
              //       ))}
              //     </CardContainer>
              //   ),
              // },
            ]}
            index={tabIndex}
            onChange={setTabIndex}
          />
        </>
      )}
    </Root>
  );
};
