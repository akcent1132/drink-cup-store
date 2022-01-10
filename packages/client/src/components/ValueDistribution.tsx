import React, { useEffect } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { useCanvas } from "../utils/useCanvas";
import { useTheme } from "@emotion/react";

// TODO read height from props

const BAR_HEIGHT = 20;
const TICK_WIDTH = 3;

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: ${BAR_HEIGHT}px;
`;

const Label = styled.div`
  flex: 0;
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
  background-color: #091d00;
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
};

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({ label, values }: Props) => {
  const theme = useTheme();
  const canvas = useCanvas();
  useEffect(() => {
    const ctx = canvas.resize();
    if (!ctx) {
      return;
    }
    const allValues = values.map((v) => v.values).flat();
    const min = Math.min(...allValues);
    const range = Math.max(...allValues) - min;
    for (const valueSet of values) {
      ctx.beginPath();
      ctx.fillStyle = theme.color(valueSet.color);
      valueSet.values.map((value) => {
        value = (value - min) / range;
        const x = Math.round(value * (canvas.width - TICK_WIDTH));

        ctx.rect(x, 0, TICK_WIDTH, canvas.height);
      });

      ctx.fill();
    }
  }, [values, canvas]);
  return (
    <Bar>
      <Label>{label}</Label>
      <Plot>
        <PlotCanvas ref={canvas.ref} />
      </Plot>
    </Bar>
  );
};
