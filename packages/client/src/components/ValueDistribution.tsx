import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { useCanvas } from "../utils/useCanvas";
import { useTheme, withTheme } from "@emotion/react";
import { scaleLinear } from "d3-scale";
import { extent, mean, minIndex, quantile } from "d3-array";
import { range, sortBy } from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import tinycolor from "tinycolor2";
import { PlantingData } from "../stories/NestedRows";
import { useHoveredPlantingContext } from "../contexts/HoveredPlantingContext";
import { ValuePopup } from "./ValuePopup";
import { format } from "d3-format"
import { useFiltersContext } from "../contexts/FiltersContext";
import { useEffectDebugger } from "../utils/useEffectDebugger";

// TODO read height from props

export const defaultTheme = {
  rowGap: 8,
  rowHeight: 24,
  tabSize: 6,
  branchWidth: 3,
  tickWidth: 2,
  meanTickWidth: 6,
  varianceLineHeight: 8,
};

type OpenState = "open" | "closed" | "parentClosed";

const Bar = withTheme(styled.div<{
  openState: OpenState;
}>`
  display: flex;
  position: relative;
  width: 100%;
  height: ${(p) =>
    p.openState === "parentClosed"
      ? 0
      : p.theme.valueDistribution.rowHeight +
        p.theme.valueDistribution.rowGap}px;
  opacity: ${(p) => (p.openState === "parentClosed" ? 0 : 1)};
  pointer-events: ${(p) => (p.openState === "parentClosed" ? "none" : "auto")};
  transition: all 0.3s cubic-bezier(0.17, 0.42, 0.28, 0.99);
  transform: translateY(${(p) => (p.openState === "parentClosed" ? -12 : 0)}px);
`);

const Label = withTheme(styled.div<{
  nesting: number;
  childCount: number;
  isHovering: boolean;
}>`
  flex: 0;
  position: relative;
  margin-top: ${(p) =>
    p.theme.valueDistribution.varianceLineHeight +
    p.theme.valueDistribution.rowGap / 2}px;
  margin-bottom: ${(p) => p.theme.valueDistribution.rowGap / 2}px;
  min-width: ${(p) => 145 - p.nesting * p.theme.valueDistribution.tabSize}px;
  font-size: 13.5px;
  font-family: ${(p) => p.theme.font};
  font-weight: ${(p) => (p.childCount > 0 ? 700 : 400)};
  text-transform: uppercase;
  line-height: ${(p) =>
    p.theme.valueDistribution.rowHeight -
    p.theme.valueDistribution.varianceLineHeight}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
  color: ${(p) => p.theme.colors.textPrimary};
  background-color: ${(p) => p.theme.colors.treeTitlePrimary};
  ${(p) =>
    p.childCount === 0
      ? `background: linear-gradient(to right, ${p.theme.colors.treeTitlePrimary}, ${p.theme.colors.treeTitleSecondary} 6px);`
      : ""}
  border-bottom-left-radius: ${(p) =>
    p.nesting === 0 ? p.theme.valueDistribution.branchWidth : 0}px;
  border-top-left-radius: ${(p) =>
    p.nesting === 0 ? p.theme.valueDistribution.branchWidth : 0}px;
  transition: all 0.2s cubic-bezier(0.17, 0.42, 0.28, 0.99);
  cursor: pointer;
`);

const BranchLeft = withTheme(styled.div<{
  isEnd: boolean;
}>`
  width: ${(p) => p.theme.valueDistribution.branchWidth}px;
  height: 100%;
  margin-left: ${(p) =>
    p.theme.valueDistribution.tabSize -
    p.theme.valueDistribution.branchWidth}px;
  position: relative;
  top: ${(p) => -p.theme.valueDistribution.rowGap / 2}px;
  background-color: ${(p) => p.theme.colors.treeTitlePrimary};
  ${(p) =>
    p.isEnd
      ? `border-bottom-left-radius: ${p.theme.valueDistribution.branchWidth}px;`
      : ""}
`);

const BranchLeftHidden = withTheme(styled.div<{}>`
  width: ${(p) => p.theme.valueDistribution.tabSize}px;
`);

const Plot = withTheme(styled.div`
  flex: 1;
  min-width: 0px;
  position: relative;
  margin: ${(p) => p.theme.valueDistribution.rowGap / 2}px 0;
`);

const PlotCanvas = styled.canvas`
  width: 100%;
  position: absolute;
  height: 100%;
`;

const LabelIcon = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
`;

type Props = {
  /**
   * Data name
   */
  label: string;
  averageValues: PlantingData[][];
  valueNames: string[] | string;
  highlightedFiltering?: string | null;
  className?: string;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
  onToggleChildren: () => void;
  openState: "open" | "closed" | "parentClosed";
  onClickData: (value: PlantingData, color: string) => void;
};

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = ({
  label,
  averageValues,
  highlightedFiltering,
  valueNames,
  onClickData,
  ...props
}: Props) => {
  valueNames = useMemo(() => Array.isArray(valueNames) ? valueNames : [valueNames], [valueNames]);
  const { colors } = useTheme();
  const [{ filters }] = useFiltersContext()
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredData, setHoveredData] = useHoveredPlantingContext();
  const onHoverData = useCallback(
    (planting: string) => setHoveredData({ type: "hover", planting }),
    []
  );
  const onLeaveData = useCallback(
    (planting: string) => setHoveredData({ type: "leave", planting }),
    []
  );
  const theme = useTheme();
  const canvas = useCanvas();
  const values = useMemo(() => {
    const average = {
      plantings: averageValues,
      color: tinycolor("white").setAlpha(0.1).toString(),
      name: "average",
    };
    return [average, ...filters].map(
      ({ plantings, color, name: filterName }) => ({
        color,
        values: plantings
          .map(
            (p) => p.filter((v) => valueNames.includes(v.name)) //.map((v) => v.value)
          )
          .flat(),
        showVariance: filterName !== "average",
        isSelectable: filterName !== "average",
        isHighlighted: highlightedFiltering === filterName,
      })
    );
  }, [filters, highlightedFiltering, valueNames]);
  const allData = useMemo(() => values.map((v) => v.values).flat(), [values]);
  const allValues = useMemo(() => allData.map((d) => d.value), [allData]);
  const scale = useMemo(() => {
    const [min, max] = extent(allValues);
    return scaleLinear()
      .domain([min || 0, max || 1])
      .rangeRound([
        theme.valueDistribution.tickWidth / 2,
        canvas.width - theme.valueDistribution.tickWidth / 2,
      ]);
  }, [allValues, canvas.width]);
  const allMean = useMemo(() => mean(allValues) || 0, [allValues]);
  const [localHoveredValue, setLocalHoveredValue] =
    useState<PlantingData | null>(null);
  const handlePlotMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const allSelectableData = values
        .filter((v) => v.isSelectable)
        .map((v) => v.values)
        .flat();
      const allSelectableValues = allSelectableData.map((d) => d.value);
      if (allSelectableValues.length === 0) {
        return;
      }
      if (e.nativeEvent.offsetY < theme.valueDistribution.varianceLineHeight) {
        if (localHoveredValue) {
          onLeaveData(localHoveredValue.id);
        }
        return;
      }
      const mouseX = e.nativeEvent.offsetX;
      const targetValue = scale.invert(mouseX);
      const closestData =
        allSelectableData[
          minIndex(allSelectableValues, (v) => Math.abs(v - targetValue))
        ];
      const closestValueX = scale(closestData.value);
      const newLocalHoveredValue =
        Math.abs(closestValueX - mouseX) < 3 ? closestData : null;
      if (newLocalHoveredValue) {
        onHoverData(newLocalHoveredValue.id);
      } else if (localHoveredValue) {
        onLeaveData(localHoveredValue.id);
      }
      setLocalHoveredValue(newLocalHoveredValue);
    },
    [scale, values, localHoveredValue]
  );
  const handlePlotMouseLeave = useCallback(() => {
    if (localHoveredValue) {
      onLeaveData(localHoveredValue.id);
    }
    setLocalHoveredValue(null);
  }, [localHoveredValue]);
  const handlePlotMouseClick = useCallback(() => {
    if (localHoveredValue) {
      const color = values.find((v) =>
        v.values.some((v) => v.id === localHoveredValue.id)
      )?.color;
      if (color) {
        onClickData(localHoveredValue, color);
      }
    }
  }, [localHoveredValue, values]);

  useEffect(() => {
    const ctx = canvas.resize();
    if (!ctx) {
      return;
    }
    // draw background
    ctx.fillStyle =
      props.childCount === 0 ? colors.treeBgSecondary : colors.treeBgPrimary;
    ctx.rect(
      0,
      theme.valueDistribution.varianceLineHeight,
      canvas.width,
      canvas.height
    );
    ctx.fill();

    const thereAreHighlighteds = values.some((v) => v.isHighlighted);
    for (const valueSet of sortBy(values, "isHighlighted")) {
      ctx.beginPath();
      const color = tinycolor(valueSet.color);
      ctx.fillStyle = !thereAreHighlighteds
        ? valueSet.color
        : valueSet.isHighlighted
        ? color.saturate(2).toString()
        : color
            .desaturate(12)
            .setAlpha(color.getAlpha() / 2)
            .toString();
      // ctx.shadowColor = tinycolor(theme.color(valueSet.color))
      //   .brighten(12)
      //   .toString();
      // ctx.shadowBlur = valueSet.isHighlighted ? 4 : 0;

      if (valueSet.showVariance) {
        const values = valueSet.values.map((v) => v.value);
        const q1 = quantile(values, 0.25);
        const q3 = quantile(values, 0.75);
        if (q1 && q3) {
          // Draw variance line
          ctx.rect(
            scale(q1),
            theme.valueDistribution.varianceLineHeight / 2,
            scale(q3) - scale(q1),
            theme.valueDistribution.varianceLineHeight / 2
          );
          ctx.fill();

          // Draw horns
          [q1, q3].forEach((value, i) => {
            const hFr2 =
              Math.ceil(theme.valueDistribution.varianceLineHeight / 2) + 1;
            const xValue = scale(value);
            ctx.beginPath();
            ctx.moveTo(xValue, 0);
            ctx.lineTo(xValue, hFr2);
            if (i === 0) {
              ctx.lineTo(xValue + hFr2, hFr2);
            } else {
              ctx.lineTo(xValue - hFr2, hFr2);
            }
            ctx.closePath();
            ctx.fill();
          });
        }
      }

      // draw ticks
      valueSet.values.map((value) => {
        ctx.rect(
          scale(value.value) - theme.valueDistribution.tickWidth / 2,
          theme.valueDistribution.varianceLineHeight,
          theme.valueDistribution.tickWidth,
          canvas.height
        );
      });

      ctx.fill();
    }

    // Draw mean
    if (allValues.length > 0) {
      ctx.beginPath();
      ctx.fillStyle = theme.color("red");
      ctx.rect(
        scale(allMean) - theme.valueDistribution.meanTickWidth / 2,
        theme.valueDistribution.varianceLineHeight,
        theme.valueDistribution.meanTickWidth,
        canvas.height
      );
      ctx.fill();
    }

    // Draw hover
    if (hoveredData) {
      ctx.beginPath();
      ctx.fillStyle = theme.color("white");
      allData.map((data) => {
        if (data.id === hoveredData) {
          ctx.rect(
            scale(data.value) - theme.valueDistribution.tickWidth / 2,
            theme.valueDistribution.varianceLineHeight,
            theme.valueDistribution.tickWidth,
            canvas.height
          );
        }
      });
      ctx.fill();
    }
  }, [values, canvas.width, canvas.height, scale, allMean, hoveredData]);

  const leftBranches = props.nesting - props.hideBranches;

  const formatValue = useMemo(() => format(".3f"), []);

  return (
    <Bar className={props.className} openState={props.openState}>
      {range(props.hideBranches).map((i) => (
        <BranchLeftHidden key={`blh-${i}`} />
      ))}
      {range(leftBranches).map((i) => (
        <BranchLeft
          key={`bl-${i}`}
          isEnd={props.isLastChild && i === leftBranches - 1}
        />
      ))}
      <Label
        nesting={props.nesting || 0}
        childCount={props.childCount || 0}
        onClick={() => props.onToggleChildren()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        isHovering={isHovering && props.openState === "closed"}
      >
        {label}
        {isHovering && props.childCount > 0 ? (
          <LabelIcon>
            {props.openState === "open" ? (
              <ExpandLessIcon fontSize="inherit" />
            ) : (
              <ExpandMoreIcon fontSize="inherit" />
            )}
          </LabelIcon>
        ) : null}
      </Label>
      <Plot>
        <PlotCanvas
          onMouseMove={handlePlotMouseMove}
          onMouseLeave={handlePlotMouseLeave}
          onClick={handlePlotMouseClick}
          ref={canvas.ref}
        />

        {localHoveredValue ? (
          <ValuePopup
            value={`${formatValue(localHoveredValue.value)}`}
            x={scale(localHoveredValue.value)}
            y={theme.valueDistribution.varianceLineHeight}
          />
        ) : null}
      </Plot>
    </Bar>
  );
};
