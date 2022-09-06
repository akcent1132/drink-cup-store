/** @jsxImportSource @emotion/react */

import { css, useTheme, withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import useSize from "@react-hook/size";
import { extent, minIndex } from "d3-array";
import { scaleTime } from "d3-scale";
import { timeMonth, timeYear } from "d3-time";
import { timeFormat } from "d3-time-format";
import { capitalize, sortBy, uniqBy } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ReactComponent as IconAmendments } from "../../assets/foodIcons/noun-cooperative-4476250.svg";
import { ReactComponent as IconWeeding } from "../../assets/foodIcons/noun-hand-weeding-4475618.svg";
import { ReactComponent as IconHarvest } from "../../assets/foodIcons/noun-harvest-4475810.svg";
import { ReactComponent as IconJoker } from "../../assets/foodIcons/noun-indigenous-knowledge-4476235.svg";
import { ReactComponent as IconSeeding } from "../../assets/foodIcons/noun-seeds-4475904.svg";
import { ReactComponent as IconTillage } from "../../assets/foodIcons/noun-till-amount-4475900.svg";
import { ReactComponent as IconIrrigation } from "../../assets/foodIcons/noun-water-drop-4476116.svg";
import { surveyStackApiUrl } from "../../utils/env";
import { useXOverlap } from "../../utils/useOverlap";
import { EventDetailsPopup } from "./EventDetailsPopup";
import { PlantingCardListQuery } from "./PlantingCardList.generated";

export const defaultTheme = {
  iconSize: 26,
  dateFontSize: 11,
  middleLineMargin: 6,
  tickWidth: 3,
  tickHeight: 10,
  timelineHeight: 2,
  timelineColor: "rgba(255, 255, 255, 0.5)",
  timelineMouseMaxDistance: 6,
  timelineTopMargin: 4,
  timeFormat: "%b %Y",
};

export const getEventIcon = (type: string) => {
  switch (type) {
    case "amendments":
      return IconAmendments;
    case "weeding":
      return IconWeeding;
    case "harvest":
      return IconHarvest;
    case "seeding":
      return IconSeeding;
    case "tillage":
      return IconTillage;
    case "irrigation":
      return IconIrrigation;
    default:
      return IconJoker;
  }
};

// TODO read height from prop
const Bar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const IconContainer = withTheme(styled.div`
  padding: 3px 10px;
  position: relative;
`);

const DateContainer = withTheme(styled.div`
  height: ${(p) => p.theme.iconEventsBar.dateFontSize}px;
  position: relative;
  font-size: ${(p) => p.theme.iconEventsBar.dateFontSize}px;
  color: white;
  font-family: ${(p) => p.theme.font};
  display: flex;
  justify-content: space-between;
  padding: 0 3px;
`);

const DateText = withTheme(styled.div<{ left: number }>`
  position: absolute;
  left: ${(p) => p.left}px;
  white-space: nowrap;
  width: 0;
  display: flex;
  justify-content: center;
`);

const Tick = withTheme(styled.div<{ x: number }>`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: ${(p) => p.x - p.theme.iconEventsBar.tickWidth / 2}px;
  width: ${(p) => p.theme.iconEventsBar.tickWidth}px;
  height: ${(p) => p.theme.iconEventsBar.tickHeight}px;
  border-radius: ${(p) => p.theme.iconEventsBar.tickWidth / 2}px;
`);

const getHighlightStyle = (
  hoveredEventType: string | null,
  selectedEventType: string | null,
  eventType: string,
  highlightColor: string,
  type: string
) => {
  const isHighlighted =
    (selectedEventType === null && hoveredEventType === eventType) ||
    selectedEventType === eventType;
  const isFaded =
    hoveredEventType !== eventType &&
    selectedEventType !== null &&
    selectedEventType !== eventType;

  return type === "icon"
    ? css`
        opacity: ${isFaded ? 0.5 : 1};
        fill: ${isHighlighted ? highlightColor : "white"};
      `
    : css`
        opacity: ${isFaded ? 0.5 : 1};
        background-color: ${isHighlighted ? highlightColor : "white"};
      `;
};

const TimelineRoot = withTheme(styled.div`
  margin-top: ${(p) => p.theme.iconEventsBar.timelineTopMargin}px;
  margin-bottom: 11px;
  position: relative;
  width: 100%;
  height: ${(p) => p.theme.iconEventsBar.tickHeight}px;
`);

const TimelineLine = withTheme(styled.div`
  margin-top: ${(p) =>
    (p.theme.iconEventsBar.tickHeight - p.theme.iconEventsBar.timelineHeight) /
    2}px;
  height: ${(p) => p.theme.iconEventsBar.timelineHeight}px;
  background-color: ${(p) => p.theme.iconEventsBar.timelineColor};
`);

export type FarmEvent = {
  id: string;
  type: string;
  date: Date;
};

type Props = {
  events: NonNullable<PlantingCardListQuery["plantings"][number]>["events"];
  minEventDate?: Date;
  maxEventDate?: Date;
};

const useStateLater = <T,>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  const timeoutId = useRef<null | NodeJS.Timeout>(null);
  const setLater = useCallback((value, time: number | null = null) => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    if (time === null) {
      setValue(value);
    } else {
      timeoutId.current = setTimeout(() => setValue(value), time);
    }
  }, []);
  return [value, setLater] as [T, typeof setLater];
};

/**
 * Primary UI component for user interaction
 */
export const IconEventsBar = (props: Props) => {
  const events = useMemo(
    () =>
      (props.events || []).map((e) => ({ ...e, date: new Date(e.date), x: 0 })),
    [props.events]
  );
  const [hoveredEventType, setHoveredEventType] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null
  );
  // ugly hacks to test event details card behaviors
  const [hoveredEvent, setHoveredEvent] = useStateLater<
    typeof events[number] | null
  >(null);
  const [hoveredCard, setHoveredCard] = useState<typeof events[number] | null>(
    null
  );
  const [fixedEvent, setFixedEvent] = useState<typeof events[number] | null>(
    null
  );
  const popupEvent = hoveredCard || hoveredEvent || fixedEvent;

  const ref = useRef<HTMLDivElement>(null);
  const refDate = useRef<HTMLDivElement>(null);
  const refDateStart = useRef<HTMLDivElement>(null);
  const refDateEnd = useRef<HTMLDivElement>(null);
  const hideStartDate = useXOverlap(refDate, refDateStart, [hoveredEvent]);
  const hideEndDate = useXOverlap(refDate, refDateEnd, [hoveredEvent]);
  const [width, _] = useSize(ref);
  const { iconEventsBar: theme, colors } = useTheme();

  const scale = useMemo(() => {
    let [start, end] = extent(
      [
        props.minEventDate,
        props.maxEventDate,
        ...events.map((e) => e.date),
      ].filter((d): d is Date => !!d)
    );
    if (!start || !end) {
      start = timeYear.floor(new Date());
      end = timeYear.ceil(new Date());
    }
    // pad the scale with one month
    start = timeMonth.offset(start, -1);
    end = timeMonth.offset(end, 1);

    const xStart = theme.middleLineMargin + theme.iconSize / 2;
    const xEnd = (width || 100) - theme.middleLineMargin - theme.iconSize / 2;
    const scale = scaleTime().domain([start, end]).range([xStart, xEnd]);
    return scale;
  }, [width, theme.middleLineMargin, props.minEventDate, props.maxEventDate]);

  // spread out overlapping event ticks
  const spreadOutEvents = useMemo(() => {
    const minWidth = theme.tickWidth + 1;
    const positions = sortBy(
      events.map((event) => ({ ...event, x: scale(event.date) })),
      "x"
    );

    // nodge each tick left/right if the closest neighbout is to close
    // while keeping the original horizontal order
    const maxIterations = 300;
    for (let j = 0; j < maxIterations; ++j) {
      let changed = false;
      for (let i = 0; i < positions.length; ++i) {
        if (i < positions.length - 1) {
          // move to the left
          const rightDist = positions[i + 1].x - positions[i].x;
          if (rightDist < minWidth) {
            changed = true;
            const leftEdge = positions[i - 1]?.x || 0;
            const maxLeftMove = positions[i].x - leftEdge;
            positions[i].x -= Math.min((minWidth - rightDist) / 2, maxLeftMove);
          }
        }

        // move to the right
        if (i > 0) {
          const leftDist = positions[i].x - positions[i - 1].x;
          if (leftDist < minWidth) {
            changed = true;
            const rightEdge = positions[i + 1]?.x || width;
            const maxRightMove = rightEdge - positions[i].x;
            positions[i].x += Math.min((minWidth - leftDist) / 2, maxRightMove);
          }
        }
      }

      if (!changed) {
        break;
      }
    }

    return positions;
  }, [scale, events, width]);

  const closestEventToMouse = useCallback(
    (mouseEvent: React.MouseEvent) => {
      const mouseX = mouseEvent.nativeEvent.offsetX;
      const closestEventIndex = minIndex(spreadOutEvents, (pos) => {
        const diff = Math.abs(pos.x - mouseX);
        return diff <= theme.timelineMouseMaxDistance ? diff : null;
      });
      return closestEventIndex >= 0 ? spreadOutEvents[closestEventIndex] : null;
    },
    [spreadOutEvents, theme.timelineMouseMaxDistance, scale]
  );
  const eventClickOut = useCallback(() => {
    setFixedEvent(null);
    setHoveredEvent(null);
    setHoveredCard(null);
  }, []);
  const eventHover = useCallback(
    (e: React.MouseEvent) => {
      const event = closestEventToMouse(e);
      setHoveredEvent(event, event ? null : 500);
    },
    [closestEventToMouse]
  );
  const eventClick = useCallback(
    (e: React.MouseEvent) => {
      setFixedEvent(closestEventToMouse(e));
    },
    [closestEventToMouse]
  );
  const eventLeave = useCallback(() => {
    setHoveredEvent(null, 500);
  }, []);

  return (
    <ClickAwayListener onClickAway={eventClickOut}>
      <Bar ref={ref}>
        <IconContainer>
          {uniqBy(events, (e) => e.type).map((event, i) => {
            const iconProps = {
              id: `icon-${event.id}`,
              key: event.id,
              css: [
                css`
                  :hover {
                    opacity: 1;
                  }
                  transition: opacity 0.4s ease-out;
                  opacity: 0.7;
                `,
                getHighlightStyle(
                  hoveredEventType || hoveredEvent?.type || null,
                  selectedEventType,
                  event.type,
                  colors.secondary,
                  "icon"
                ),
              ],
              width: theme.iconSize,
              height: theme.iconSize,
              // fill: "white",
              title: event.type,
              onMouseEnter: () => setHoveredEventType(event.type),
              onMouseLeave: () => setHoveredEventType(null),
              onClick: () =>
                setSelectedEventType(
                  selectedEventType === event.type ? null : event.type
                ),
            };

            const Icon = getEventIcon(event.type);
            return <Icon {...iconProps} />;
          })}
        </IconContainer>
        <DateContainer>
          {/* {hoveredEvent ? (
          <DateText left={scale(hoveredEvent.date)}>
            <div ref={refDate}>{timeFormat(theme.timeFormat)(hoveredEvent.date)}</div>
          </DateText>
        ) : null} */}

          <div
            ref={refDateStart}
            css={css`
              opacity: ${hideStartDate ? 0 : 1};
            `}
          >
            {timeFormat(theme.timeFormat)(scale.domain()[0])}
          </div>

          <div
            ref={refDateEnd}
            css={css`
              opacity: ${hideEndDate ? 0 : 1};
            `}
          >
            {timeFormat(theme.timeFormat)(
              new Date(scale.domain()[1].getTime() - 1)
            )}
          </div>
        </DateContainer>
        <div
          css={css`
            position: relative;
          `}
        >
          {popupEvent ? (
            <EventDetailsPopup
              eventDetails={popupEvent.details}
              key={popupEvent.id}
              date={`${timeFormat("%b %-d, %Y")(popupEvent.date)}`}
              title={capitalize(popupEvent.type)}
              x={popupEvent.x}
              y={theme.tickHeight + theme.timelineTopMargin}
              onMouseEnter={(e) => popupEvent && setHoveredCard(popupEvent)}
              onMouseLeave={(e) => setHoveredCard(null)}
              onClose={eventClickOut}
              debugInfo={{
                detailsSource: surveyStackApiUrl(
                  `static/coffeeshop/events_new/${popupEvent.id}`
                ),
                ...popupEvent,
              }}
            />
          ) : null}
        </div>
        <TimelineRoot
          onClick={eventClick}
          onMouseMove={(e) => eventHover(e)}
          onMouseLeave={() => eventLeave()}
        >
          <TimelineLine />
          {spreadOutEvents.map((event) => {
            const tick = (
              <Tick
                x={event.x}
                css={getHighlightStyle(
                  hoveredEventType || hoveredEvent?.type || null,
                  selectedEventType,
                  event.type,
                  colors.secondary,
                  "tick"
                )}
                key={`tick-${event.id}`}
              />
            );
            return tick;
          })}
        </TimelineRoot>
      </Bar>
    </ClickAwayListener>
  );
};
