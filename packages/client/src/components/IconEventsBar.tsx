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
import { forceCollide, forceSimulation, forceY } from "d3-force";
import { getFarmEvent } from "../utils/random";
import { useXOverlap } from "../utils/useOverlap";
import { capitalize, uniqBy } from "lodash";
import { ValuePopup } from "./ValuePopup";
import { EventDetailsPopup } from "./EventDetailsPopup";

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

const useLastNonNull = <T,>(value: T) => {
  const last = useRef<T | null>(null);
  if (value) {
    last.current = value;
  }
  return last.current;
};

import { useReducer } from "react";
import { makeVar, useReactiveVar } from "@apollo/client";

const reactiveVar = makeVar(performance.now());


/**
 * Primary UI component for user interaction
 */
export const IconEventsBar = (props: Props) => {
  const [reducerState, dispatch] = useReducer(
    (_: number, time: number) => time,
    performance.now()
  );
  const reactiveState = useReactiveVar(reactiveVar);

  const reducerUpdateTime = useMemo(() => performance.now() - reducerState, [
    reducerState
  ]);
  const reactiveUpdateTime = useMemo(() => performance.now() - reactiveState, [
    reactiveState
  ]);
  return (
    <div className="App">
      <button onClick={() => dispatch(performance.now())}>
        update reducer
      </button>
      <h2>
        reducer update time: {reducerUpdateTime} (clicked at: {reducerState})
      </h2>

      <button onClick={() => reactiveVar(performance.now())}>
        update reactive var
      </button>
      <h2>
        reactive var update time: {reactiveUpdateTime} (clicked at:{" "}
        {reactiveState})
      </h2>
    </div>
  );
};
