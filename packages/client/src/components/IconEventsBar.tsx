/** @jsxImportSource @emotion/react */

import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { css, useTheme } from "@emotion/react";
import { timeFormat } from "d3-time-format";
import { timeYear } from "d3-time";
import { ScaleTime, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { ReactComponent as IconAmendments } from "../assets/foodIcons/noun-cooperative-4476250.svg";
import { ReactComponent as IconWeeding } from "../assets/foodIcons/noun-hand-weeding-4475618.svg";
import { ReactComponent as IconHarvest } from "../assets/foodIcons/noun-harvest-4475810.svg";
import { ReactComponent as IconSeeding } from "../assets/foodIcons/noun-seeds-4475904.svg";
import { ReactComponent as IconTillage } from "../assets/foodIcons/noun-till-amount-4475900.svg";
import { ReactComponent as IconIrrigation } from "../assets/foodIcons/noun-water-drop-4476116.svg";
import { ReactComponent as IconJoker } from "../assets/foodIcons/noun-indigenous-knowledge-4476235.svg";
import useSize from "@react-hook/size";
import { forceCenter, forceCollide, forceSimulation, forceY } from "d3-force";

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

type IconNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX?: number;
  event: FarmEvent;
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

const dateForce = (() => {
  let nodes: IconNode[] = [];
  let scale: ScaleTime<number, number, never>;
  const force = (alpha: number) => {
    if (!scale) return;

    nodes.map((node) => {
      node.vx += (scale(node.event.date) - node.x) * alpha;
      node.targetX = scale(node.event.date);
    });
  };
  force.initialize = (n: IconNode[]) => (nodes = n);
  force.setScale = (n: ScaleTime<number, number, never>) => (scale = n);
  return force;
})();

/**
 * Primary UI component for user interaction
 */
export const EventsBar = (props: Props) => {
  const events = props.events || [];
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useSize(ref);
  const theme = useTheme().iconEventsBar;
  const simulation = useMemo(
    () =>
      forceSimulation<IconNode>([])
        .force("y", forceY(30))
        .force("date", dateForce)
        .force("radius", forceCollide(theme.iconSize*0.55)),
    []
  );
  const scale = useMemo(() => {
    const [first, last] = extent(events.map((e) => e.date));
    const start = timeYear.floor(first || new Date());
    const end = timeYear.ceil(last || new Date());

    const xStart = theme.middleLineMargin;
    const xEnd = (width || 100) - theme.middleLineMargin;
    const scale = scaleTime().domain([start, end]).range([xStart, xEnd]);
    dateForce.setScale(scale);
    simulation.tick(100).alpha(1).restart();
    return scale;
  }, [width, theme.middleLineMargin]);
  const [nodes, setNodes] = useState<IconNode[]>([]);

  // add events to the simulation
  useEffect(() => {
    const n = simulation.nodes;
    simulation.nodes(
      events.map((event) => ({
        x: scale(event.date),
        y: 30,
        vx: 0,
        vy: 0,
        event,
      }))
    );
    // simulation.restart();
  }, [events]);
  useEffect(() => {
    simulation.on("tick", () => {
      setNodes(simulation.nodes());
    });
  }, []);
  nodes.forEach(({ event, x, y, vx, targetX }) =>
    console.log({ x, y, vx, targetX })
  );
  console.log("sim alpha", simulation.alpha())
  return (
    <Bar ref={ref}>
      {nodes.map(({ event, x, y }) => {
        const iconProps = {
          css: css`
            position: absolute;
            left: ${x}px;
            top: ${y}px;
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
