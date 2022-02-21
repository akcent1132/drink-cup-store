/** @jsxImportSource @emotion/react */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import "../index.css";
import { css, useTheme, withTheme } from "@emotion/react";
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
import { getFarmEvent } from "../utils/random";

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
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
`;

const DateText = withTheme(styled.div<{ left: number }>`
  position: absolute;
  top: 60px;
  left: ${(p) => p.left}px;
  font-size: 11px;
  color: white;
  font-family: ${(p) => p.theme.font};
  width: 0;
  white-space: nowrap;
  display: flex;
  justify-content: center;
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

const createDateForce = () => {
  let nodes: IconNode[] = [];
  let scale: ScaleTime<number, number, never>;
  const force = (alpha: number) => {
    if (!scale) return;

    nodes.map((node) => {
      node.vx += (scale(node.event.date) - node.x) * alpha * 0.2;
      const [left, right] = scale.range();
      node.x = Math.max(left, Math.min(right, node.x))
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
  const [hoveredEvent, setHoveredEvent] = useState<FarmEvent | null>(null);
  const ref = useRef<HTMLDivElement>(null);
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
    simulation.tick(100).alpha(1).restart();
    return scale;
  }, [width, theme.middleLineMargin]);
  const addClick = useCallback(
    (e: React.MouseEvent) => {
      const event = getFarmEvent();
      event.date = scale.invert(e.nativeEvent.offsetX);
      setEvents([...events, event]);
    },
    [scale, events]
  );
  const removeClick = useCallback(
    (e: React.MouseEvent, event: FarmEvent) => {
      e.stopPropagation();
      setEvents(events.filter(({ id }) => id !== event.id));
    },
    [events]
  );

  const eventHover = useCallback((event) => {
    setHoveredEvent(event);
  }, []);
  const eventLeave = useCallback(
    (event) => {
      if (hoveredEvent && hoveredEvent.id === event.id) {
        setHoveredEvent(null);
      }
    },
    [hoveredEvent]
  );

  // add events to the simulation
  useEffect(() => {
    // removes nodes of non-existing events
    const nodes = simulation
      .nodes()
      .filter((node) => events.some((event) => event.id === node.event.id));
    // add missing nodes to the simulation
    for (const event of events) {
      if (!nodes.some((n) => n.event.id === event.id)) {
        nodes.push({
          x: scale(event.date),
          y: 30,
          vx: 0,
          vy: 0,
          event,
        });
      }
    }
    simulation.nodes(nodes).alpha(1).tick(500).restart();
  }, [events]);
  useEffect(() => {
    simulation.on("tick", () => {
      if (!ref.current) {
        return;
      }

      for (const node of simulation.nodes()) {
        const icon = ref.current.querySelector<SVGElement>(
          `#icon-${node.event.id}`
        );
        if (icon) {
          icon.style.left = `${node.x - theme.iconSize / 2}px`;
          icon.style.top = `${node.y}px`;
          icon.style.opacity = "1";
        }
      }
    });
  }, []);
  return (
    <Bar ref={ref} onClick={addClick}>
      {events.map((event) => {
        const iconProps = {
          id: `icon-${event.id}`,
          key: event.id,
          css: css`
            position: absolute;
            :hover {
              transform: scale(1.12);
            }
            transition: all 0.4s cubic-bezier(0.56, 1.49, 0.67, 0.99);
            opacity: 0;
          `,
          width: theme.iconSize,
          height: theme.iconSize,
          fill: "white",
          title: event.type,
          onClick: (e: React.MouseEvent) => removeClick(e, event),
          onMouseEnter: () => eventHover(event),
          onMouseLeave: () => eventLeave(event),
        };

        const Icon = getEventIcon(event.type);
        return <Icon {...iconProps} />;
      })}
      {hoveredEvent ? (
        <DateText left={scale(hoveredEvent.date)}>
          <div>{timeFormat("%b %-d")(hoveredEvent.date)}</div>
        </DateText>
      ) : null}
    </Bar>
  );
};
