/** @jsxImportSource @emotion/react */

import React, { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { css, useTheme } from "@emotion/react";
import { timeFormat } from "d3-time-format";
import { timeYear } from "d3-time";
import { scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { ReactComponent as IconAmendments } from "../assets/foodIcons/noun-cooperative-4476250.svg";
import { ReactComponent as IconWeeding } from "../assets/foodIcons/noun-hand-weeding-4475618.svg";
import { ReactComponent as IconHarvest } from "../assets/foodIcons/noun-harvest-4475810.svg";
import { ReactComponent as IconSeeding } from "../assets/foodIcons/noun-seeds-4475904.svg";
import { ReactComponent as IconTillage } from "../assets/foodIcons/noun-till-amount-4475900.svg";
import { ReactComponent as IconIrrigation } from "../assets/foodIcons/noun-water-drop-4476116.svg";
import { ReactComponent as IconJoker } from "../assets/foodIcons/noun-indigenous-knowledge-4476235.svg";
import useSize from "@react-hook/size";

export const defaultTheme = {
  iconSize: 26,
  middleLineMargin: 6,
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
  width: 100%;
  height: 80px;
`;

const Plot = styled.canvas`
  flex: 1;
  height: 100%;
  min-width: 0px;
`;

export type FarmEvent = {
  type: string;
  date: Date;
};

export const defaultKnobs = Object.freeze({
  middleLineWidth: 3,
  middleLineColor: "white",
  middleLineY: 20,
  tickWidth: 5,
  tickHeight: 17,
});

type Props = {
  events?: FarmEvent[];
  knobs?: Partial<typeof defaultKnobs>;
};

const drawTickText = (
  ctx: CanvasRenderingContext2D,
  date: Date,
  x: number,
  y: number
) => {
  const text = timeFormat("%b %-d")(date);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 4);
  ctx.textAlign = "right";
  ctx.fillText(text, 0, 0);
  ctx.restore();
};

/**
 * Primary UI component for user interaction
 */
export const EventsBar = (props: Props) => {
  const events = props.events || [];
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(ref);
  console.log({ width, height });
  const theme = useTheme().iconEventsBar;
  const scale = useMemo(() => {
    const [first, last] = extent(events.map((e) => e.date));
    const start = timeYear.floor(first || new Date());
    const end = timeYear.ceil(last || new Date());

    const xStart = theme.middleLineMargin;
    const xEnd = (width || 100) - theme.middleLineMargin;
    console.log({ start, end, xStart, xEnd });
    return scaleTime().domain([start, end]).range([xStart, xEnd]);
  }, [width, theme.middleLineMargin]);

  return (
    <Bar ref={ref}>
      {events.map((event) => {
        const iconProps = {
          css: css`
            position: absolute;
            left: ${scale(event.date)}px;
          `,
          width: theme.iconSize,
          height: theme.iconSize,
          fill: "white",
          title: event.type,
        };
        const Icon = getEventIcon(event.type);
        return <Icon {...iconProps} />;
      })}
    </Bar>
  );
};
