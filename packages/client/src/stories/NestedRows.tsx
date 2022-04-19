import { findLastIndex, last } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { RowData } from "../contexts/rows";


const flattenRows = (
  rows: RowData[],
  nesting = 0
): {
  row: RowData;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
  childRowNames: string[];
}[] =>
  rows
    .map((row) => {
      const children = flattenRows(row.children || [], nesting + 1);
      const childCount = children
        ? findLastIndex(children, { nesting: nesting + 1 }) + 1
        : 0;
      children.slice(childCount).forEach((child) => (child.hideBranches += 1));
      return [
        {
          row,
          nesting,
          childCount,
          isLastChild: row === last(rows),
          hideBranches: 0,
          childRowNames: children.map((c) => c.row.name),
        },
        ...children,
      ];
    })
    .flat();

export const NestedRows = ({
  rows,
  onClickData,
}: {
  rows: RowData[];
  onClickData: (plantingId: string, color: string) => void;
}) => {
  const flatRows = useMemo(() => flattenRows(rows), [rows]);
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
            onClickData={onClickData}
          />
        )
      )}
    </React.Fragment>
  );
};
