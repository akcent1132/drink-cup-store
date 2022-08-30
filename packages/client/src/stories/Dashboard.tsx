/** @jsxImportSource @emotion/react */

import React, {
  ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { useSidePanelContent } from "../states/sidePanelContent";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ClassNames } from "@emotion/core";
import styled from "@emotion/styled";
import "../index.css";
import bgCorn from "../assets/images/Background-corngrains.jpg";
import logoImage from "../assets/images/Farmers-coffeeshop-logo-white_transparent.png";
import { Tabs } from "../components/Tabs";
import { css, withTheme } from "@emotion/react";
import { HyloBox } from "./HyloBox";
import { FilterEditor } from "../components/filterEditor/FilterEditor";
import { FarmerProfile } from "../components/FarmerProfile";
import { PlantingCardList } from "../components/PlantingCardList";
import { client } from "../graphql/client";
import { ApolloProvider } from "@apollo/client";
import { usePreloadDataQuery } from "./Dashboard.generated";
import { Box, Layer } from "grommet";
import CircularProgress from "@mui/material/CircularProgress";
import { CompareTab } from "../components/compareTab/CompareTab";
import { AuthMenu } from "../components/auth/AuthMenu";
import { LoginDialog } from "../components/auth/LoginDialog";
import { Notifications } from "../components/Notifications";
import {
  useSetupUIToShowRelevantInfoToUser,
  useTryAcceptingMagicLinkLogin,
} from "../states/auth";
import { TourStop } from "../states/TourStop";
import { Stop } from "../states/tour";

const Root = withTheme(styled.div`
  width: 100%;
  height: 100%;
  min-height: 1600px;
  padding-left: 52px;
  box-sizing: border-box;
  ${(p) =>
    p.theme.useBackgroundImage
      ? `
      background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 4) 0%,
        rgba(0, 0, 0, 0.34) 10%
      ),
      url(${bgCorn});
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
  `
      : ""}

  background-color: ${(p) => p.theme.colors.bg};
  display: grid;
  grid-template-columns: 1fr max(500px, 34%);
  grid-template-rows: 60px auto;
  grid-template-areas: "values header" "values events";
  & > * {
    overflow: hidden;
    max-width: 100%;
  }
`);

const Header = styled.div`
  grid-area: header;
  display: flex;
  justify-content: flex-end;
  padding: 0 12px;
`;

const RightSide = styled.div`
  grid-area: events;
  position: relative;
`;

const RightFlipContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

interface Props {
  /**
   * URL for the Hylo iframe box
   */
  iframeSrc: string;
}

export const Dashboard = ({ iframeSrc }: Props) => {
  useTryAcceptingMagicLinkLogin();
  const { loading } = usePreloadDataQuery();
  const setupUi = useSetupUIToShowRelevantInfoToUser();
  useEffect(() => {
    if (!loading) {
      setupUi();
    }
  }, [loading]);
  const sidePanelContent = useSidePanelContent();
  const [tabIndex, setTabIndex] = useState(0);
  const rightSide = useRef<HTMLDivElement>(null);
  const pages = useMemo(
    () => [
      {
        label: "Compare",
        renderPanel: () => <CompareTab />,
      },
    ],
    []
  );

  const [SideContent, sideContentKey] = useMemo(
    () =>
      sidePanelContent.type === "FilterEditor"
        ? [
            <FilterEditor selectedFilterId={sidePanelContent.filterId} />,
            `FilterEditor-${sidePanelContent.filterId}`,
          ]
        : sidePanelContent.type === "Profile"
        ? [
            <FarmerProfile producerId={sidePanelContent.producerId} />,
            `FarmerProfile-${sidePanelContent.producerId}`,
          ]
        : [
            <PlantingCardList
              openEventCardIds={sidePanelContent.plantingIds}
            />,
            `PlantingCards`,
          ],
    [sidePanelContent]
  );

  return (
    <Root>
      {loading ? (
        <Layer full background="rgba(255,255,255,0.3)" animate={false}>
          <Box fill align="center" justify="center">
            <CircularProgress />
          </Box>
        </Layer>
      ) : null}
      <Header>
        <AuthMenu></AuthMenu>
        <img
          css={css`
            height: 72%;
            width: auto;
            align-self: center;
          `}
          src={logoImage}
          width="180"
        />
      </Header>
      <Tabs
        css={css`
          grid-area: values;
          /* header_height - tabs-height */
          margin-top: 30px;
        `}
        pages={pages}
        index={tabIndex}
        onChange={setTabIndex}
      />
      <RightSide ref={rightSide}>
        <ClassNames>
          {({ css, cx }) => (
            <TransitionGroup>
              <CSSTransition
                in
                key={sideContentKey}
                classNames={{
                  enter: css({
                    zIndex: 2,
                    opacity: 0,
                    transform: "translateX(-2%);",
                  }),
                  enterActive: css({
                    opacity: 1,
                    transform: "translateX(0%);",
                    transition: "all 300ms ease-out",
                  }),
                  exit: css({ zIndex: 1 }),
                  exitActive: css({
                    opacity: 0,
                    transition: "all 300ms  ease-in",
                  }),
                }}
                timeout={600}
              >
                <RightFlipContainer>{SideContent}</RightFlipContainer>
              </CSSTransition>
            </TransitionGroup>
          )}
        </ClassNames>

        <TourStop stop={Stop.DISCUSS} placement="left-start">
          <HyloBox container={rightSide} src={iframeSrc} />
        </TourStop>
      </RightSide>
      <LoginDialog />
    </Root>
  );
};

export const App = (props: ComponentProps<typeof Dashboard>) => (
  <ApolloProvider client={client}>
    <RecoilRoot>
      <RecoilNexus />
      <Dashboard {...props} />
      <Notifications />
    </RecoilRoot>
  </ApolloProvider>
);
