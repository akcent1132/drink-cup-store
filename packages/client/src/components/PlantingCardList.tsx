/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import "../index.css";
import { ClassNames } from "@emotion/react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useEffect, useMemo, useState } from "react";
import { EventsCard } from "./EventsCard";
import { usePlantingCardListQuery } from "./PlantingCardList.generated";
import { extent } from "d3-array";
import { useFilters } from "../states/filters";
import { getPlantingIdsOfFilter } from "../utils/getPlantingsOfFilter";
import { Backdrop, CircularProgress, LinearProgress } from "@mui/material";

const Events = styled.div`
  display: flex;
  padding: 0px 33px 50px 0px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
`;

const visibleStyles = {
  opacity: 1,
  transform: "translateX(0%);",
  maxHeight: "250px",
};

const hiddenStyles = {
  opacity: 0,
  transform: "translateX(-20%);",
  maxHeight: "0px",
};

const CardWrapper = styled.div`
  z-index: 2;
  position: relative;
`;

export const PlantingCardList = ({
  openEventCardIds,
}: {
  openEventCardIds: string[];
}) => {
  const query = usePlantingCardListQuery({
    variables: { plantingIds: openEventCardIds },
  });
  const { plantings } = query.data ?? query.previousData ?? {};
  console.log({plantings})
  // find out which filter colors should we add to a card
  const filters = useFilters();
  const matchingFilterColorsPerPlanting = useMemo(() => {
    console.log("RECOMPUTE matchingFilterColorsPerPlanting");
    const matchingPlantingIdsPerFilter = filters.map((filter) =>
      getPlantingIdsOfFilter(filter, plantings || [])
    );
    return (plantings || []).map((planting) =>
      filters
        .filter((_, i) => matchingPlantingIdsPerFilter[i].includes(planting.id))
        .map((filter) => filter.color)
    );
  }, [filters, plantings]);
  const [minDate, maxDate] = useMemo(() => {
    const dates = (plantings || [])
      .map((p) => p.events || [])
      .flat()
      .map((e) => new Date(e.date));
    return extent(dates);
  }, [plantings]);
  if (!openEventCardIds || openEventCardIds.length === 0) {
    return null;
  }

  return (
    <Events>
      <Backdrop
      transitionDuration={200}
      invisible
        sx={{  zIndex:  3 }}
        open={query.loading}
      >
        <CircularProgress  />
      </Backdrop>
      {/* {(plantings||[]).map((planting, i) => (
        <CardWrapper key={planting.id}>
          <EventsCard
            planting={planting}
            minEventDate={minDate}
            maxEventDate={maxDate}
            colors={matchingFilterColorsPerPlanting[i]}
          />
        </CardWrapper>
      ))} */}
      <ClassNames>
        {({ css }) =>
          !openEventCardIds ? null : (
            <TransitionGroup>
              {(plantings||[]).map((planting, i) => (
                <CSSTransition
                  key={planting.id}
                  classNames={{
                    enter: css({
                      zIndex: 3,
                      ...hiddenStyles,
                    }),
                    enterActive: css({
                      ...visibleStyles,
                      transition: "all 500ms ease-in-out",
                    }),
                    exit: css({ zIndex: 1, ...visibleStyles }),
                    exitActive: css({
                      ...hiddenStyles,
                      transition: "all 500ms ease-in-out",
                    }),
                  }}
                  timeout={600}
                >
                  <CardWrapper>
                    <EventsCard
                      planting={planting}
                      minEventDate={minDate}
                      maxEventDate={maxDate}
                      colors={matchingFilterColorsPerPlanting[i]}
                    />
                  </CardWrapper>
                </CSSTransition>
              ))}
            </TransitionGroup>
          )
        }
      </ClassNames>
    </Events>
  );
};
