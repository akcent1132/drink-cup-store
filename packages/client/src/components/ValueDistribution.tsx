import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { useCanvas } from "../utils/useCanvas";
import { useTheme, withTheme } from "@emotion/react";
import { scaleLinear } from "d3-scale";
import { extent, mean, quantile, zip } from "d3-array";
import { pull, range, sortBy } from "lodash";

// TODO read height from props

export const defaultKnobs = Object.freeze({
  barHeight: 24,
  tickWidth: 3,
  varianceLineHeight: 8,
  varianceStripeWidth: 8,
});

const Bar = styled.div<{ knobs: typeof defaultKnobs }>`
  display: flex;
  width: 100%;
  height: ${(props) => props.knobs.barHeight}px;
`;

const Label = withTheme(styled.div<{ knobs: typeof defaultKnobs }>`
  flex: 0;
  margin-top: ${(props) => props.knobs.varianceLineHeight}px;
  min-width: 145px;
  font-size: 14px;
  font-family: ${(props) => props.theme.fonts.baseBold};
  text-transform: uppercase;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  color: white;
  background-color: #80945a;
`);

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
  showVariance?: boolean;
  isHighlighted?: boolean;
};

type Props = {
  /**
   * Data name
   */
  label: string;
  values: Values[];
  knobs?: Partial<typeof defaultKnobs>;
  className?: string;
};

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({ label, values, ...props }: Props) => {
  const knobs = { ...defaultKnobs, ...props.knobs };
  const theme = useTheme();
  const canvas = useCanvas();
  const allValues = useMemo(() => values.map((v) => v.values).flat(), [values]);
  const scale = useMemo(() => {
    const [min, max] = extent(allValues);
    return scaleLinear()
      .domain([min || 0, max || 1])
      .rangeRound([0, canvas.width - knobs.tickWidth]);
  }, [allValues, canvas.width]);
  const allMean = useMemo(() =>  mean(allValues) || 0, [allValues]);

  const varianceBounds = useMemo(() => {
    return sortBy(
      values
        .filter((v) => v.showVariance)
        .map(({ values, color }) => {
          const q1 = quantile(values, 0.25);
          const q3 = quantile(values, 0.75);
          return q1 && q3
            ? [
                { type: "start", color, value: q1 },
                { type: "stop", color, value: q3 },
              ]
            : [];
        })
        .flat(),
      "value"
    );
  }, [values]);

  useEffect(() => {
    const ctx = canvas.resize();
    if (!ctx) {
      return;
    }
    // draw background
    ctx.fillStyle = "#091d00";
    ctx.rect(0, knobs.varianceLineHeight, canvas.width, canvas.height);
    ctx.fill();

    const currentColors: string[] = [];
    let lastValue = 0;
    for (const { type, color, value } of varianceBounds) {
      const hFr2 = knobs.varianceLineHeight / 2;
      const xStart = scale(lastValue);
      const xValue = scale(value);
      const xWidth = xValue - xStart;
      ctx.beginPath();
      ctx.fillStyle = theme.color(color);
      ctx.moveTo(xValue, 0);
      ctx.lineTo(xValue, hFr2);
      if (type === "start") {
        ctx.lineTo(xValue + hFr2, hFr2);
      } else {
        ctx.lineTo(xValue - hFr2, hFr2);
      }
      ctx.closePath();
      ctx.fill();

      // if (currentColors.length === 1) {
      //   ctx.beginPath();
      //   ctx.fillStyle = theme.color(currentColors[0]);
      //   ctx.rect(xStart, hFr2, xWidth, hFr2);
      //   ctx.fill();

      //   // draw overlapping lines
      // } else if (currentColors.length > 1) {
      //   ctx.save();
      //   let region = new Path2D();
      //   region.rect(xStart, hFr2, xWidth, hFr2);
      //   ctx.clip(region);
      //   ctx.lineCap = "square";
      //   ctx.lineWidth = knobs.varianceStripeWidth;
      //   const steps = [
      //     ...range(xStart, xStart + xWidth, knobs.varianceStripeWidth),
      //     xStart + xWidth,
      //   ];
      //   steps.forEach((x, i) => {
      //     ctx.beginPath();
      //     ctx.strokeStyle = theme.color(
      //       currentColors[i % currentColors.length]
      //     );
      //     ctx.moveTo(x, hFr2);
      //     ctx.lineTo(x - hFr2, knobs.varianceLineHeight);
      //     ctx.stroke();
      //   });
      //   ctx.restore();
      // }
      lastValue = value;
      if (type === "start") {
        currentColors.push(color);
      } else {
        pull(currentColors, color);
      }
    }

    for (const valueSet of sortBy(values, "isHighlighted")) {
      ctx.beginPath();
      ctx.fillStyle = theme.color(valueSet.color);

      if (valueSet.showVariance) {
        const q1 = quantile(valueSet.values, 0.25);
        const q3 = quantile(valueSet.values, 0.75);
        if (q1 && q3) {
          ctx.rect(
            scale(q1),
            knobs.varianceLineHeight / 2,
            scale(q3) - scale(q1),
            knobs.varianceLineHeight / 2
          );
        }
      }

      // draw ticks
      valueSet.values.map((value) => {
        ctx.rect(
          scale(value),
          knobs.varianceLineHeight,
          knobs.tickWidth,
          canvas.height
        );
      });

      ctx.fill();
    }

    // Draw mean
    ctx.beginPath();
      ctx.fillStyle = theme.color('red');
      ctx.rect(
        scale(allMean),
        knobs.varianceLineHeight,
        knobs.tickWidth * 2,
        canvas.height
      );


    ctx.fill();
  }, [values, canvas, scale, allMean]);

  return (
    <Bar knobs={knobs} className={props.className}>
      <Label knobs={knobs}>{label}</Label>
      <Plot>
        <PlotCanvas ref={canvas.ref} />
      </Plot>
    </Bar>
  );
};
