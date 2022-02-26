/** @jsxImportSource @emotion/react */

import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { css, useTheme, withTheme } from "@emotion/react";
import { timeFormat } from "d3-time-format";
import { timeYear } from "d3-time";
import { ScaleTime, scaleTime } from "d3-scale";
import { extent, minIndex } from "d3-array";
import { ReactComponent as IconAmendments } from "../assets/foodIcons/noun-cooperative-4476250.svg";
import { ReactComponent as IconWeeding } from "../assets/foodIcons/noun-hand-weeding-4475618.svg";
import { ReactComponent as IconHarvest } from "../assets/foodIcons/noun-harvest-4475810.svg";
import { ReactComponent as IconSeeding } from "../assets/foodIcons/noun-seeds-4475904.svg";
import { ReactComponent as IconTillage } from "../assets/foodIcons/noun-till-amount-4475900.svg";
import { ReactComponent as IconIrrigation } from "../assets/foodIcons/noun-water-drop-4476116.svg";
import { ReactComponent as IconJoker } from "../assets/foodIcons/noun-indigenous-knowledge-4476235.svg";
import useSize from "@react-hook/size";
import { forceCenter, forceCollide, forceSimulation, forceY } from "d3-force";
import { getFarmEvent } from "../utils/random";
import { useXOverlap } from "../utils/useOverlap";
import { uniqBy } from "lodash";

export const defaultTheme = {
  iconSize: 26,
  dateFontSize: 11,
  middleLineMargin: 6,
  tickWidth: 3,
  tickHeight: 10,
  timelineHeight: 2,
  timelineColor: "#4d4d4d",
  highlightColor: "#fff683",
  timelineMouseMaxDistance: 6,
};

const getEventIcon = (type: string) => {
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
  height: ${(p) => p.theme.iconEventsBar.iconSize * 2}px;
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
  margin-top: 4px;
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

type IconNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX?: number;
  event: FarmEvent;
};

type Props = {
  events?: FarmEvent[];
};

const createDateForce = () => {
  let nodes: IconNode[] = [];
  let scale: ScaleTime<number, number, never>;
  const force = (alpha: number) => {
    if (!scale) return;

    nodes.map((node) => {
      node.vx += (scale(node.event.date) - node.x) * alpha * 0.2;
      const [left, right] = scale.range();
      node.x = Math.max(left, Math.min(right, node.x));
      node.y = Math.min(node.y, 30);
      node.targetX = scale(node.event.date);
    });
  };
  force.initialize = (n: IconNode[]) => (nodes = n);
  force.setScale = (n: ScaleTime<number, number, never>) => (scale = n);
  return force;
};

/**
 * Primary UI component for user interaction
 */
export const IconEventsBar = (props: Props) => {
  const [events, setEvents] = useState(props.events || []);
  const [hoveredEventType, setHoveredEventType] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null
  );
  const [hoveredEvent, setHoveredEvent] = useState<FarmEvent | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const refDate = useRef<HTMLDivElement>(null);
  const refDateStart = useRef<HTMLDivElement>(null);
  const refDateEnd = useRef<HTMLDivElement>(null);
  const hideStartDate = useXOverlap(refDate, refDateStart, [hoveredEvent]);
  const hideEndDate = useXOverlap(refDate, refDateEnd, [hoveredEvent]);
  const [width, height] = useSize(ref);
  const theme = useTheme().iconEventsBar;
  const dateForce = useMemo(() => createDateForce(), []);
  const simulation = useMemo(
    () =>
      forceSimulation<IconNode>([])
        .force("y", forceY(30).strength(0.6))
        .force("date", dateForce)
        .force("radius", forceCollide(theme.iconSize * 0.55)),
    []
  );
  const scale = useMemo(() => {
    const [first, last] = extent(events.map((e) => e.date));
    const start = timeYear.floor(first || new Date());
    const end = timeYear.ceil(last || new Date());

    const xStart = theme.middleLineMargin + theme.iconSize / 2;
    const xEnd = (width || 100) - theme.middleLineMargin - theme.iconSize / 2;
    const scale = scaleTime().domain([start, end]).range([xStart, xEnd]);
    dateForce.setScale(scale);
    simulation.alpha(1).tick(500).restart();
    return scale;
  }, [width, theme.middleLineMargin]);
  const addClick = useCallback(
    (e: React.MouseEvent) => {
      if (hoveredEvent) {
        setEvents(events.filter(({ id }) => id !== hoveredEvent.id));
      } else {
        const event = getFarmEvent();
        event.date = scale.invert(e.nativeEvent.offsetX);
        setEvents([...events, event]);
      }
    },
    [scale, events, hoveredEvent]
  );
  const eventHover = useCallback(
    (e: React.MouseEvent) => {
      const mouseX = e.nativeEvent.offsetX;
      const closestEventIndex = minIndex(events, (event) => {
        const diff = Math.abs(scale(event.date) - mouseX);
        return diff <= theme.timelineMouseMaxDistance ? diff : null;
      });
      if (closestEventIndex >= 0) {
        setHoveredEvent(events[closestEventIndex]);
      } else {
        setHoveredEvent(null);
      }
    },
    [theme.timelineMouseMaxDistance, events, scale]
  );
  const eventLeave = useCallback(() => setHoveredEvent(null), []);

  return (
    <Bar ref={ref}>
      <IconContainer>
        {uniqBy(events, (e) => e.type).map((event, i) => {
          const iconProps = {
            id: `icon-${event.id}`,
            key: event.id,
            css: [
              css`
                left: ${(theme.iconSize / 2) * (i + 1)}px;
                top: ${i % 2 === 1 ? theme.iconSize * (11 / 13) : 0}px;
                position: absolute;
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
                theme.highlightColor,
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
        {hoveredEvent ? (
          <DateText left={scale(hoveredEvent.date)}>
            <div ref={refDate}>{timeFormat("%b %-d")(hoveredEvent.date)}</div>
          </DateText>
        ) : null}
 
          <div ref={refDateStart} css={css`
            opacity: ${hideStartDate ? 0 : 1};
          `}>
            {timeFormat("%b %-d")(scale.domain()[0])}
          </div>

          <div ref={refDateEnd} css={css`
            opacity: ${hideEndDate ? 0 : 1};
          `}>
            {timeFormat("%b %-d")(new Date(scale.domain()[1].getTime() - 1))}
          </div>
      </DateContainer>
      <TimelineRoot
        onClick={addClick}
        onMouseMove={(e) => eventHover(e)}
        onMouseLeave={() => eventLeave()}
      >
        <TimelineLine />
        {events.map((event) => (
          <Tick
            x={scale(event.date)}
            css={getHighlightStyle(
              hoveredEventType || hoveredEvent?.type || null,
              selectedEventType,
              event.type,
              theme.highlightColor,
              "tick"
            )}
            key={`tick-${event.id}`}
          />
        ))}
      </TimelineRoot>
    </Bar>
  );
};
