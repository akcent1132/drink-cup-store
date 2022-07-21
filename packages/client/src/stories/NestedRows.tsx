import { findLastIndex, last, remove } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { RowData } from "../contexts/rows";
import { NestedRowsQuery, useNestedRowsQuery } from "./NestedRows.generated";

const getLabeledValues = (
  filters: NestedRowsQuery["filters"],
  plantings: NestedRowsQuery["plantings"]
) => {
  const matchedPlantingIds = filters
    .map((f) => f.plantings.map((p) => p.id))
    .flat();
  const unmatchedPlantings = plantings.filter(
    (p) => !matchedPlantingIds.includes(p.id)
  );

  const labeledValues = [
    { id: "unmatched_values", color: null, plantings: unmatchedPlantings },
    ...filters,
  ]
    .map(({ id, color, plantings }) =>
      plantings
        .map((planting) => planting.values)
        .flat()
        .map((value) => ({
          ...value,
          filter: {
            id,
            color,
          },
        }))
    )
    .flat();
    console.log("???",{filters, plantings, labeledValues})
  return labeledValues;
};

const flattenRows = (
  rows: RowData[],
  labeledValues: ReturnType<typeof getLabeledValues>,
  nesting = 0
): {
  row: RowData;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
  childRowNames: string[];
  allData: {
    filter: {
      id: string;
      color: string | null;
    };
    name: string;
    value: number;
    modusId?: string | null;
    plantingId: string;
  }[];
}[] =>
  rows
    .map((row) => {
      const children = flattenRows(
        row.children || [],
        labeledValues,
        nesting + 1
      );
      const childCount = children
        ? findLastIndex(children, { nesting: nesting + 1 }) + 1
        : 0;
      children.slice(childCount).forEach((child) => (child.hideBranches += 1));

      const childRowNames = children.map((c) => c.row.name);
      const { name, showAggregation } = row;
      const valueNames = showAggregation ? childRowNames : [name];
      const allData = labeledValues.filter((v) => valueNames.includes(v.name));

      if (
        allData.length === 0 &&
        children.every((c) => c.allData.length === 0)
      ) {
        return [];
      }

      return [
        {
          row,
          nesting,
          childCount,
          isLastChild: row === last(rows),
          hideBranches: 0,
          childRowNames,
          allData,
        },
        ...children,
      ];
    })
    .flat();

export const NestedRows = ({ rows }: { rows: RowData[] }) => {
  const {
    data: { filters, plantings, highlightedFilterId, highlightedPlantingId } = {},
  } = useNestedRowsQuery();
  const labeledValues = useMemo(
    () => (filters && plantings ? getLabeledValues(filters, plantings) : []),
    [filters, plantings]
  );
  console.log('???', {filters, plantings, labeledValues})
  const flatRows = useMemo(
    () => flattenRows(rows, labeledValues),
    [rows, labeledValues]
  );
  const [isClosed, setIsClosed] = useState<boolean[]>(
    new Array(rows.length).fill(false)
  );
  const toggleOpen = useCallback(
    (rowIndex: number) => {
      const states = [...isClosed];
      states[rowIndex] = !states[rowIndex];
      setIsClosed(states);
    },
    [isClosed]
  );
  const openStates = useMemo(() => {
    let closedAtLevel = -1;
    return flatRows.map(({ nesting }, rowIndex) => {
      if (closedAtLevel < 0) {
        if (isClosed[rowIndex]) {
          closedAtLevel = nesting;
          return "closed";
        } else {
          return "open";
        }
      } else {
        if (closedAtLevel < nesting) {
          return "parentClosed";
        } else if (isClosed[rowIndex]) {
          closedAtLevel = nesting;
          return "closed";
        } else {
          closedAtLevel = -1;
          return "open";
        }
      }
    });
  }, [flatRows, isClosed]);

  return (
    <React.Fragment>
      {flatRows.map(
        (
          {
            row: { name, showAggregation },
            nesting,
            childCount,
            isLastChild,
            hideBranches,
            childRowNames,
            allData,
          },
          i
        ) => (
          <ValueDistribution
            key={`${name}-${i}`}
            label={name}
            valueNames={showAggregation ? childRowNames : name}
            nesting={nesting}
            childCount={childCount}
            isLastChild={isLastChild}
            hideBranches={hideBranches}
            onToggleChildren={() => toggleOpen(i)}
            openState={openStates[i]!}
            highlightedFilterId={highlightedFilterId || undefined}
            highlightedPlantingId={highlightedPlantingId || undefined}
            allData={allData}
          />
        )
      )}
    </React.Fragment>
  );
};
