import { useTheme, withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { extent, mean, minIndex, quantile } from "d3-array";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { groupBy, range, sortBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import tinycolor from "tinycolor2";
import {
  useHighlightPlanting,
  useUnhighlightPlanting,
} from "../../../states/highlightedPlantingId";
import {
  useAddPlantingCard,
  useShowPlantingCards,
} from "../../../states/sidePanelContent";
import { useCanvas } from "../../../utils/useCanvas";
import { ValuePopup } from "./ValuePopup";

export const defaultTheme = {
  rowGap: 8,
  rowHeight: 20,
  tabSize: 6,
  branchWidth: 3,
  tickWidth: 2,
  meanTickWidth: 3,
  varianceLineHeight: 3,
  labelWidth: 190,
  averageColor: tinycolor("white").setAlpha(0.1).toString(),
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
  isHoveringLabel: boolean;
}>`
  flex: 0;
  position: relative;
  margin-top: ${(p) => p.theme.valueDistribution.rowGap / 2}px;
  margin-bottom: ${(p) => p.theme.valueDistribution.rowGap / 2}px;
  min-width: ${(p) =>
    p.theme.valueDistribution.labelWidth -
    p.nesting * p.theme.valueDistribution.tabSize}px;
  font-size: 13.5px;
  font-family: ${(p) => p.theme.font};
  font-weight: ${(p) => (p.childCount > 0 ? 700 : 400)};
  text-transform: uppercase;
  line-height: ${(p) => p.theme.valueDistribution.rowHeight}px;
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
  valueNames: string[] | string;
  className?: string;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
  onToggleChildren: () => void;
  openState: "open" | "closed" | "parentClosed";
  highlightedFilterId?: string;
  highlightedPlantingId?: string;
  allData: {
    matchingFilters: {
      id: string;
      color: string | null;
    }[];
    name: string;
    value: number;
    modusTestId?: string | null;
    unit?: string | null;
    plantingId: string;
  }[];
};

/**
 * Primary UI component for user interaction
 */
export const ValueDistribution = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      valueNames,
      highlightedFilterId,
      highlightedPlantingId,
      allData,
      ...props
    },
    ref
  ) => {
    valueNames = useMemo(
      () => (Array.isArray(valueNames) ? valueNames : [valueNames]),
      [valueNames]
    );
    const { colors } = useTheme();
    const [isHoveringLabel, setIsHoveringLabel] = useState(false);
    const [isHoveringRow, setIsHoveringRow] = useState(false);
    const highlightPlanting = useHighlightPlanting();
    const unhighlightPlanting = useUnhighlightPlanting();
    const showPlantingCards = useShowPlantingCards();
    const addPlantingCard = useAddPlantingCard();
    const onHoverData = useCallback(
      (planting: string) => highlightPlanting(planting),
      []
    );
    const onLeaveData = useCallback(
      (planting: string) => unhighlightPlanting(planting),
      []
    );
    const theme = useTheme();
    const canvas = useCanvas();
    // const allData = useMemo(
    //   () =>
    //     groupedValues
    //       .map((v) => {
    //         return v.values
    //           .filter((v) => valueNames.includes(v.name))
    //           .map((data) => ({ ...data, filter: v.filter }));
    //       })
    //       .flat(),
    //   [groupedValues, valueNames]
    // );
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
    const [localHoveredValue, setLocalHoveredValue] = useState<
      typeof allData[number] | null
    >(null);
    const handlePlotMouseMove = useCallback(
      (e: React.MouseEvent) => {
        const allSelectableValues = allData.map((d) => d.value);
        if (allSelectableValues.length === 0) {
          return;
        }
        if (
          e.nativeEvent.offsetY < theme.valueDistribution.varianceLineHeight
        ) {
          if (localHoveredValue) {
            onLeaveData(localHoveredValue.plantingId);
          }
          return;
        }
        const mouseX = e.nativeEvent.offsetX;
        const targetValue = scale.invert(mouseX);
        const closestData =
          allData[
            minIndex(allSelectableValues, (v) => Math.abs(v - targetValue))
          ];
        const closestValueX = scale(closestData.value);
        const newLocalHoveredValue =
          Math.abs(closestValueX - mouseX) < 3 ? closestData : null;
        if (newLocalHoveredValue) {
          onHoverData(newLocalHoveredValue.plantingId);
        } else if (localHoveredValue) {
          onLeaveData(localHoveredValue.plantingId);
        }
        setLocalHoveredValue(newLocalHoveredValue);
      },
      [scale, allData, localHoveredValue]
    );
    const handlePlotMouseLeave = useCallback(() => {
      if (localHoveredValue) {
        onLeaveData(localHoveredValue.plantingId);
      }
      setLocalHoveredValue(null);
    }, [localHoveredValue]);
    const handlePlotMouseClick = useCallback(() => {
      if (localHoveredValue) {
        addPlantingCard(localHoveredValue.plantingId);
        showPlantingCards();
      }
    }, [localHoveredValue]);

    // useEffectDebugger(
    //   () => {},
    //   [groupedValues, highlightedPlanting, localHoveredValue, highlightedFilter],
    //   [
    //     "groupedValues",
    //     "highlightedPlanting",
    //     "localHoveredValue",
    //     "highlightedFilter",
    //   ]
    // );

    // select maximum one filter for each value
    const allDataWithFilter = useMemo(
      () =>
        allData.map((value) => ({
          ...value,
          filter:
            value.matchingFilters.find((f) => f.id === highlightedFilterId) ||
            value.matchingFilters.length
              ? value.matchingFilters[0]
              : null,
        })),
      [allData, highlightedFilterId]
    );

    useEffect(() => {
      const ctx = canvas.resize();
      if (!ctx) {
        return;
      }
      // draw background
      ctx.fillStyle =
        props.childCount === 0 ? colors.treeBgSecondary : colors.treeBgPrimary;
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();

      let valuesGrouppedByFilter = Object.values(
        groupBy(allDataWithFilter, (value) => value.filter?.id)
      );
      // move values to front (top) if they match the highlightedFilterId
      valuesGrouppedByFilter = sortBy(valuesGrouppedByFilter, (valueSet) =>
        valueSet[0].matchingFilters.some((f) => f.id === highlightedFilterId)
      );

      for (const valueSet of valuesGrouppedByFilter) {
        const filter = valueSet[0].filter;
        ctx.beginPath();
        const color = tinycolor(
          filter?.color || theme.valueDistribution.averageColor
        );
        ctx.fillStyle = !highlightedFilterId
          ? color.toString()
          : highlightedFilterId === filter?.id
          ? color.saturate(2).toString()
          : color
              .desaturate(12)
              .setAlpha(color.getAlpha() / 2)
              .toString();

        // draw variance line
        if (filter) {
          const values = valueSet.map((v) => v.value);
          const q1 = quantile(values, 0.25);
          const q3 = quantile(values, 0.75);
          if (q1 && q3) {
            // Draw variance line
            ctx.rect(
              scale(q1),
              0,
              scale(q3) - scale(q1),
              theme.valueDistribution.varianceLineHeight
            );

            // Draw horns
            // [q1, q3].forEach((value, i) => {
            //   const hFr2 = theme.valueDistribution.varianceLineHeight / 2;
            //   const xValue = scale(value);
            //   ctx.moveTo(xValue, 0);
            //   ctx.lineTo(xValue, hFr2);
            //   if (i === 0) {
            //     // left horn
            //     ctx.lineTo(xValue + hFr2, hFr2);
            //   } else {
            //     // right horn
            //     ctx.lineTo(xValue - hFr2, hFr2);
            //   }
            // });
            ctx.fill();
          }
        }

        // draw ticks
        valueSet.map((value) => {
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
          0,
          theme.valueDistribution.meanTickWidth,
          theme.valueDistribution.varianceLineHeight
        );
        ctx.fill();
      }

      // Draw hover
      if (highlightedPlantingId) {
        ctx.beginPath();
        ctx.fillStyle = theme.color("white");
        allDataWithFilter.map((data) => {
          if (data.plantingId === highlightedPlantingId) {
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
    }, [
      allDataWithFilter,
      canvas.width,
      canvas.height,
      scale,
      allMean,
      highlightedPlantingId,
      highlightedFilterId,
      isHoveringRow,
    ]);

    const leftBranches = props.nesting - props.hideBranches;

    const formatValue = useMemo(() => format(".3f"), []);

    return (
      <Bar
        ref={ref}
        className={props.className}
        openState={props.openState}
        onMouseEnter={() => setIsHoveringRow(true)}
        onMouseLeave={() => setIsHoveringRow(false)}
      >
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
          onMouseEnter={() => setIsHoveringLabel(true)}
          onMouseLeave={() => setIsHoveringLabel(false)}
          isHoveringLabel={isHoveringLabel && props.openState === "closed"}
        >
          {label}
          {props.childCount > 0 ? (
            <LabelIcon>
              {props.openState === "open" ? (
                <ExpandLessIcon
                  fontSize="inherit"
                  sx={{ opacity: isHoveringLabel ? 1 : 0 }}
                />
              ) : (
                <ExpandMoreIcon
                  fontSize="inherit"
                  sx={{ opacity: isHoveringLabel ? 1 : 0.5 }}
                />
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
              value={`${formatValue(localHoveredValue.value)} ${
                localHoveredValue.unit || ""
              }`}
              x={scale(localHoveredValue.value)}
              y={theme.valueDistribution.varianceLineHeight}
            />
          ) : null}
        </Plot>
      </Bar>
    );
  }
);
