/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import "../index.css";
import { ClassNames } from "@emotion/react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React from "react";
import { EventsCard, Spacer } from "./EventsCard";
import { createFakePlantingCardData } from "../stories/Dashboard";
import { usePlantingCardListQuery } from "./PlantingCardList.generated";

type Props = {
  plantingCards: ReturnType<typeof createFakePlantingCardData>[];
  onCloseCard: (id: string) => void;
};

const Events = styled.div`
  display: flex;
  padding: 0px 33px 50px 0px;
  backdrop-filter: blur(12px);
  flex-direction: column;
  justify-content: flex-start;
`;

const CardWrapper = styled.div`
  zindex: 2;
  position: relative;
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

export const PlantingCardList = ({ plantingCards, onCloseCard }: Props) => {
  const {data: { openEventCards } = {}} = usePlantingCardListQuery();
  if (!openEventCards) {
    return null;
  }
  console.log({openEventCards})
  return (
    <Events>
      <ClassNames>
        {({ css }) => (
          <TransitionGroup>
            {openEventCards.map(({id: plantingId}) => (
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
                  <EventsCard
                    key={plantingId}
                    plantingId={plantingId}
                    onClose={() => onCloseCard(plantingId)}
                  />
                </CardWrapper>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </ClassNames>
    </Events>
  );
};
