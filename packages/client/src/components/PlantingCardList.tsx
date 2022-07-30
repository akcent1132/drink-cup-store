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

const Events = styled.div`
  display: flex;
  padding: 0px 33px 50px 0px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
`;

const CardWrapper = styled.div`
  z-index: 2;
  position: relative;
`;

export const PlantingCardList = ({
  openEventCardIds,
}: {
  openEventCardIds: string[];
}) => {
  const { data: { plantings } = {} } = usePlantingCardListQuery({
    variables: { plantingIds: openEventCardIds },
  });
  // find out which filter colors should we add to a card
  const filters = useFilters();
  const matchingFilterColorsPerPlanting = useMemo(() => {
    console.log("RECOMPUTE matchingFilterColorsPerPlanting")
    const matchingPlantingIdsPerFilter = filters.map((filter) =>
      getPlantingIdsOfFilter(filter, plantings || [])
    );
    return (plantings || []).map((planting) =>
      filters
        .filter((_, i) =>
          matchingPlantingIdsPerFilter[i].includes(planting.id)
        )
        .map((filter) => filter.color)
    );
  }, [filters, plantings]);
  const [minDate, maxDate] = useMemo(() => {
    const dates = (plantings || [])
      .map((p) => p.events)
      .flat()
      .map((e) => new Date(e.date));
    return extent(dates);
  }, [plantings]);
  if (!openEventCardIds || openEventCardIds.length === 0) {
    return null;
  }

  return (
    <Events>
      {openEventCardIds.map((plantingId, i) => (
        <CardWrapper key={plantingId}>
          <EventsCard
            key={plantingId}
            plantingId={plantingId}
            minEventDate={minDate}
            maxEventDate={maxDate}
            colors={matchingFilterColorsPerPlanting[i]}
          />
        </CardWrapper>
      ))}
      {/* <ClassNames>
        {({ css }) =>
          !openEventCardIds ? null : (
            <TransitionGroup>
              {openEventCardIds.map((plantingId) => (
                <CSSTransition
                  key={plantingId}
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
                    <EventsCard key={plantingId} plantingId={plantingId} />
                  </CardWrapper>
                </CSSTransition>
              ))}
            </TransitionGroup>
          )
        }
      </ClassNames> */}
    </Events>
  );
};
