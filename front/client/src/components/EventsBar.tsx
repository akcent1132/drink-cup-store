import React, { useCallback, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { useCanvas } from "../utils/useCanvas";
import { useTheme } from "@emotion/react";
import { timeFormat } from "d3-time-format";
import { timeYear } from "d3-time";
import { scaleTime } from "d3-scale";
import { extent } from "d3-array";

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
  color: string;
  date: Date;
};

export const defaultKnobs = Object.freeze({
  middleLineWidth: 3,
  middleLineColor: "white",
  middleLineY: 20,
  middleLineMargin: 6,
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
  const knobs = { ...defaultKnobs, ...props.knobs };
  const canvas = useCanvas();
  const theme = useTheme();
  const scale = useMemo(() => {
    const [first, last] = extent(events.map((e) => e.date));
    const start = timeYear.floor(first || new Date());
    const end = timeYear.ceil(last || new Date());

    const xStart = knobs.middleLineMargin;
    const xEnd = (canvas.width || 100) - knobs.middleLineMargin;
    return scaleTime().domain([start, end]).range([xStart, xEnd]);
  }, [canvas.width, knobs.middleLineMargin]);

  useEffect(() => {
    const ctx = canvas.ref.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    canvas.resize();
    ctx.strokeStyle = knobs.middleLineColor;
    ctx.lineWidth = knobs.middleLineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(scale.range()[0], knobs.middleLineY);
    ctx.lineTo(scale.range()[1], knobs.middleLineY);
    ctx.stroke();

    for (const event of events) {
      const x = scale(event.date);
      ctx.strokeStyle = theme.color(event.color);
      ctx.lineWidth = knobs.tickWidth;
      ctx.font = `10px ${theme.fonts.base}`;
      ctx.fillStyle = `white`;
      ctx.beginPath();
      ctx.moveTo(x, knobs.middleLineY - knobs.tickHeight / 2);
      ctx.lineTo(x, knobs.middleLineY + knobs.tickHeight / 2);
      ctx.stroke();
      drawTickText(
        ctx,
        event.date,
        x + knobs.tickWidth / 2,
        knobs.middleLineY + knobs.tickHeight / 2 + knobs.tickWidth / 2 + 6
      );
    }
  }, [knobs, events, scale]);

  return (
    <Bar>
      <Plot ref={canvas.ref} />
    </Bar>
  );
};
