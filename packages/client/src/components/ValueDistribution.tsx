import React, { useCallback } from "react";
import styled from "@emotion/styled";
import '../index.css';
import { useCanvas } from "../utils/useCanvas";

// TODO read height from props

const BAR_HEIGHT = 25;
const TICK_WIDTH = 2;

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: ${BAR_HEIGHT}px;
`;

const Label = styled.div`
  flex: 0;
  min-width: 145px;
  height: 100%;
  font-size: 17px;
  font-family: 'Acumin Pro Bold';
  text-transform: uppercase;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  color: white;
  background-color: #80945A;
`;

const Plot = styled.canvas`
  flex: 1;
  height: 100%;
  min-width: 0px;
  background-color: #091D00;
`;

interface Props {
  /**
   * Data name
   */
  label: string;
  values: number[];
}

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({
  label,
  values,
}: Props) => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const min = Math.min(...values);
    const range = Math.max(...values) - min;
    ctx.beginPath();
    ctx.fillStyle = 'white'
    values.map(value => {
      value = (value - min) / range;

      ctx.rect(value * (width - TICK_WIDTH), 0, TICK_WIDTH, height);
    })
    
    ctx.fill();
  }, [values]);
  const canvasRef = useCanvas(draw);
  return (
    <Bar>
      <Label>{label}</Label>
      <Plot ref={canvasRef} />
    </Bar>
  );
};
