import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import '../index.css';
import { useCanvas } from "../utils/useCanvas";

// TODO read height from props

const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
`;

const Label = styled.div`
  flex: 0;
  min-width: 145px;
  height: 100%;
  font-size: 11px;
  font-family: 'Acumin Pro Bold';
  text-transform: uppercase;
  line-height: 22px;
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
}

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({
  label,
}: Props) => {
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath();
    ctx.rect(3, 3, width-6, height-6);
    ctx.stroke();
  }, []);
  const canvasRef = useCanvas(draw);
  return (
    <Bar>
      <Label>{label}</Label>
      <Plot ref={canvasRef} />
    </Bar>
  );
};
