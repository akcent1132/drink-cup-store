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
  rowGap: 8,
  rowHeight: 24,
  tabSize: 6,
  branchWidth: 3,
  tickWidth: 3,
  varianceLineHeight: 8,
  varianceStripeWidth: 8,
});

const Bar = styled.div<{ knobs: typeof defaultKnobs, hideBranches: number }>`
  display: flex;
  position: relative;
  padding-left: ${p=>p.hideBranches * p.knobs.tabSize}px;
  width: 100%;
  height: ${(p) => p.knobs.rowHeight}px;
  margin: ${(p) => p.knobs.rowGap / 2}px 0;
`;

const Label = withTheme(styled.div<{
  knobs: typeof defaultKnobs;
  nesting: number;
  childCount: number;
}>`
  flex: 0;
  margin-top: ${(p) => p.knobs.varianceLineHeight}px;
  min-width: ${(p) => 145 - p.nesting * p.knobs.tabSize}px;
  font-size: 13.5px;
  font-family: ${(p) => p.theme.font};
  font-weight: ${(p) => (p.childCount > 0 ? 700 : 400)};
  text-transform: uppercase;
  line-height: ${(p) => p.knobs.rowHeight - p.knobs.varianceLineHeight}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  color: white;
  background-color: #80945a;
  ${(p) =>
    p.childCount === 0
      ? `background: linear-gradient(to right, #80945a, #6E8248 6px);`
      : ""}
  border-bottom-left-radius: ${(p) =>
    p.nesting === 0 ? p.knobs.branchWidth : 0}px;
  border-top-left-radius: ${(p) =>
    p.nesting === 0 ? p.knobs.branchWidth : 0}px;
`);

const BranchDown = styled.div<{
  knobs: typeof defaultKnobs;
  nesting: number;
  childCount: number;
}>`
  width: ${(p) => p.knobs.branchWidth}px;
  height: ${(p) => p.knobs.rowGap / 2}px;
  top: ${(p) => p.knobs.rowHeight}px;
  left: ${(p) => (p.nesting + 1) * p.knobs.tabSize - p.knobs.branchWidth}px;
  position: absolute;
  background-color: #80945a;
  // border-bottom-left-radius: ${(p) => p.knobs.branchWidth}px;
`;

const BranchLeft = styled.div<{
  knobs: typeof defaultKnobs;
  isEnd: boolean;
}>`
  width: ${(p) => p.knobs.branchWidth}px;
  height: ${(p) => p.knobs.rowHeight + (p.isEnd ? p.knobs.rowGap / 2 : p.knobs.rowGap)}px;
  margin-left: ${(p) => p.knobs.tabSize - p.knobs.branchWidth}px;
  position: relative;
  top: ${p => -p.knobs.rowGap/2}px;
  background-color: #80945a;
  ${(p) =>
    p.isEnd
      ? `border-bottom-left-radius: ${p.knobs.branchWidth}px;`
      : ""}
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
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
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
  const allMean = useMemo(() => mean(allValues) || 0, [allValues]);

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
    ctx.fillStyle = props.childCount === 0 ? "#123104" : "#091d00";
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
    ctx.fillStyle = theme.color("red");
    ctx.rect(
      scale(allMean),
      knobs.varianceLineHeight,
      knobs.tickWidth * 2,
      canvas.height
    );

    ctx.fill();
  }, [values, canvas, scale, allMean]);


  const leftBranches = props.nesting - props.hideBranches;

  return (
    <Bar knobs={knobs} className={props.className} hideBranches={props.hideBranches}>
      {range(leftBranches).map((i) => (
        <BranchLeft knobs={knobs} isEnd={props.isLastChild && i === leftBranches-1} />
      ))}
      <Label
        knobs={knobs}
        nesting={props.nesting || 0}
        childCount={props.childCount || 0}
      >
        {label}
      </Label>
      <Plot>
        <PlotCanvas ref={canvas.ref} />
      </Plot>
      {props.childCount !== 0 ? (
        <BranchDown
          knobs={knobs}
          nesting={props.nesting || 0}
          childCount={props.childCount || 0}
        />
      ) : null}
    </Bar>
  );
};
