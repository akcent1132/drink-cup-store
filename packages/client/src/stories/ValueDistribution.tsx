import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";

import { useCanvas } from "../utils/useCanvas";



const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 23px;
  background-color: tomato;
`;

const Label = styled.div`
  flex: 0;
  width: 300px;
  height: 100%;
`;

const Plot = styled.canvas`
  flex: 1;
  height: 100%;
  min-width: 0px;
  background-color: grey;
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
