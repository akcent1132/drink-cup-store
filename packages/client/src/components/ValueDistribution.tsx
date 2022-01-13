import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { useCanvas } from "../utils/useCanvas";
import { useTheme } from "@emotion/react";
import { scaleLinear } from "d3-scale";
import { quantile } from "d3-array";

// TODO read height from props



export const defaultKnobs = Object.freeze({
  barHeight: 24,
  tickWidth: 3,
  varianceLineHeight: 4,
});

const Bar = styled.div<{knobs: typeof defaultKnobs}>`
  display: flex;
  width: 100%;
  height: ${props => props.knobs.barHeight}px;
`;

const Label = styled.div<{knobs: typeof defaultKnobs}>`
  flex: 0;
  margin-top: ${props => props.knobs.varianceLineHeight}px;
  min-width: 145px;
  height: 100%;
  font-size: 14px;
  font-family: "Acumin Pro Bold";
  text-transform: uppercase;
  line-height: 23px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  color: white;
  background-color: #80945a;
`;

const Plot = styled.div`
  flex: 1;
  height: 100%;
  min-width: 0px;
  position: relative;
`;

const PlotCanvas = styled.canvas`
  width: 100%;
  position: absolute;
  height: 100%;
`;

type Values = {
  color: string;
  values: number[];
};

type Props = {
  /**
   * Data name
   */
  label: string;
  values: Values[];
  knobs?: Partial<typeof defaultKnobs>;
};

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({ label, values, ...props }: Props) => {
  const knobs = { ...defaultKnobs, ...props.knobs };
  const theme = useTheme();
  const canvas = useCanvas();
  const scale = useMemo(() => {
    const allValues = values.map((v) => v.values).flat();
    return scaleLinear()
      .domain(allValues)
      .rangeRound([0, canvas.width - knobs.tickWidth]);
  }, [values, canvas.width]);

  useEffect(() => {
    const ctx = canvas.resize();
    if (!ctx) {
      return;
    }

    // draw background
    ctx.fillStyle =  '#091d00';
    ctx.rect(0, knobs.varianceLineHeight, canvas.width, canvas.height);
    ctx.fill();

    for (const valueSet of values) {
      ctx.beginPath();
      ctx.fillStyle = theme.color(valueSet.color);

      const q1 = quantile(valueSet.values, 0.25);
      const q3 = quantile(valueSet.values, 0.75);
      if (q1 && q3) {
        ctx.rect(scale(q1), 0, scale(q3) - scale(q1), knobs.varianceLineHeight);
      }
      
      // draw ticks
      valueSet.values.map((value) => {
        ctx.rect(scale(value), knobs.varianceLineHeight, knobs.tickWidth, canvas.height);
      });

      ctx.fill();
    }
  }, [values, canvas, scale]);

  return (
    <Bar knobs={knobs}>
      <Label knobs={knobs}>{label}</Label>
      <Plot>
        <PlotCanvas ref={canvas.ref} />
      </Plot>
    </Bar>
  );
};
