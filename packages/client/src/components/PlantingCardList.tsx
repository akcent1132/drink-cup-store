/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import "../index.css";
import { ClassNames } from "@emotion/react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useEffect, useMemo, useState } from "react";
import { EventsCard } from "./EventsCard";

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

export const PlantingCardList = ({
  openEventCardIds,
}: {
  openEventCardIds: string[];
}) => {
  if (!openEventCardIds || openEventCardIds.length === 0) {
    return null;
  }

  return (
    <Events>
      {openEventCardIds.map((plantingId) => (
        <CardWrapper>
          <EventsCard key={plantingId} plantingId={plantingId} />
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
