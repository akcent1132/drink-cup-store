/** @jsxImportSource @emotion/react */

import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ClassNames } from "@emotion/core";
import styled from "@emotion/styled";
import "../index.css";
import bgCorn from "../assets/images/Background-corngrains.jpg";
import logoImage from "../assets/images/Farmers-coffeeshop-logo-white_transparent.png";
import { Tabs } from "../components/Tabs";
import { css, useTheme, withTheme } from "@emotion/react";
import { getFarmEvent, randomZone } from "../utils/random";
import { FilterLabel } from "../components/FilterLabel";
import faker from "faker";
import { memoize, range, sample, sum, uniq, uniqueId, without } from "lodash";
import { HyloBox } from "./HyloBox";
import { FilterEditor } from "../components/FilterEditor";
import { NestedRows, PlantingData } from "./NestedRows";
import { schemeTableau10 } from "d3-scale-chromatic";
import { HoveredPlantingProvider } from "../contexts/HoveredPlantingContext";
import {
  createFilteringData,
  FiltersProvider,
  useFiltersContext,
} from "../contexts/FiltersContext";
import { ROWS } from "../contexts/rows";
import { Button } from "../components/Button";
import { FarmerProfile } from "../components/FarmerProfile";
import { PlantingCardList } from "../components/PlantingCardList";

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

const PaneHead = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 20px 20px 20px;
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

const COLORS = schemeTableau10.slice(0, 9); //[
//   "purple",
//   "blue",
//   "teal",
//   "green",
//   "olive",
//   "yellow",
//   "orange",
//   // "red",
//   "violet",
// ];

function hoverReducer(
  state: string | null,
  action: { type: "enter" | "leave"; name: string }
) {
  switch (action.type) {
    case "enter":
      return action.name;
    case "leave":
      return state === action.name ? null : state;
    default:
      throw new Error();
  }
}

const RandomContent = ({
  onClickData,
}: {
  onClickData: (data: PlantingData, color: string) => void;
}) => {
  const { colors } = useTheme();
  const [hoverState, hoverDispatch] = useReducer(hoverReducer, null);
  const [{ filters }, dispatchFiltering] = useFiltersContext();
  const averageValues = useMemo(
    () => createFilteringData("average", 36, 5, 2),
    []
  );
  const addFilter = useCallback(
    (name?: string, color?: string) => {
      const freeColors = without(COLORS, ...filters.map((g) => g.color));
      name = name || faker.company.companyName();
      const _color =
        color || sample(freeColors.length > 0 ? freeColors : COLORS)!;
      dispatchFiltering({ type: "new", name, color: _color });
    },
    [filters]
  );

  useEffect(() => {
    addFilter("Produce Corn, Beef", schemeTableau10[4]);
    addFilter("General Mills - KS", schemeTableau10[0]);
    dispatchFiltering({ type: "select", filterId: null });
  }, []);

  return (
    <RowContainer>
      <PaneHead>
        {[...filters].reverse().map((filter, i) => (
          <FilterLabel
            key={filter.id}
            filterId={filter.id}
            label={filter.name}
            color={filter.color}
            onMouseEnter={() =>
              hoverDispatch({ type: "enter", name: filter.name })
            }
            onMouseLeave={() =>
              hoverDispatch({ type: "leave", name: filter.name })
            }
            isWide
            showActions
          />
        ))}
        <Button
          label="+ Add"
          color={colors.bgSidePanel}
          onClick={() => addFilter()}
        />
      </PaneHead>
      <NestedRows
        rows={ROWS}
        hoverState={hoverState}
        averageValues={averageValues}
        onClickData={onClickData}
      />
    </RowContainer>
  );
};

export const createFakePlantingCardData = memoize(
  (id: string, color: string) => {
    let texture = [Math.random(), Math.random()];
    texture = texture.map((t) => Math.round((t / sum(texture)) * 100));
    const zone = randomZone();
    return {
      id,
      title: "Corn " + (2017 + Math.floor(Math.random() * 6)),
      name: Math.random().toString(32).slice(-7), //`${faker.name.firstName()} ${faker.name.lastName()}`,
      color,
      params: {
        zone: zone.name,
        temperature: zone.temp.toString(),
        precipitation: `${32 + Math.floor(32 * Math.random())} in`,
        texture: `Sand: ${texture[0]}% | Clay ${texture[1]}%`,
      },
      events: range(6 + 6 * Math.random()).map(() => getFarmEvent()),
    };
  }
);

interface Props {
  /**
   * URL for the Hylo iframe box
   */
  iframeSrc: string;
}

export const Dashboard = ({ iframeSrc }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [plantingCards, setPlantingCards] = useState([
    createFakePlantingCardData("72", schemeTableau10[4]),
    createFakePlantingCardData("67", schemeTableau10[0]),
  ]);
  const [{ selectedFilterId, selectedFarmerId }, dispatchFilters] =
    useFiltersContext();
  const rightSide = useRef<HTMLDivElement>(null);
  const handleClickRowData = useCallback(
    (data: PlantingData, color: string) => {
      setPlantingCards(
        uniq([createFakePlantingCardData(data.id, color), ...plantingCards])
      );
      dispatchFilters({ type: "select", filterId: null });
      dispatchFilters({ type: "selectFarmer", farmerId: null });
    },
    [plantingCards]
  );

  const handleCloseCard = useCallback(
    (cardId: string) => {
      setPlantingCards(plantingCards.filter((card) => card.id !== cardId));
    },
    [plantingCards]
  );

  const pages = useMemo(
    () => [
      {
        label: "Compare",
        renderPanel: () => <RandomContent onClickData={handleClickRowData} />,
      },
      {
        label: "My Data",
        renderPanel: () => <RandomContent onClickData={handleClickRowData} />,
      },
    ],
    [handleClickRowData]
  );

  const [SideContent, sideContentKey] = useMemo(
    () =>
      selectedFilterId !== null
        ? [<FilterEditor selectedFilterId={selectedFilterId} />, "FilterEditor"]
        : selectedFarmerId !== null
        ? [
            <FarmerProfile name={selectedFarmerId} />,
            `FarmerProfile-${selectedFarmerId}`,
          ]
        : [
            <PlantingCardList
              plantingCards={plantingCards}
              onCloseCard={handleCloseCard}
            />,
            `Events`,
          ],
    [selectedFilterId, selectedFarmerId, plantingCards, handleCloseCard]
  );

  return (
    <Root>
      <Header>
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

        <HyloBox container={rightSide} src={iframeSrc} />
      </RightSide>
    </Root>
  );
};

export const App = (props: ComponentProps<typeof Dashboard>) => (
  <FiltersProvider>
    <HoveredPlantingProvider>
      <Dashboard {...props} />
    </HoveredPlantingProvider>
  </FiltersProvider>
);
