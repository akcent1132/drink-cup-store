import { findIndex, findLastIndex, last, range } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { genDataPoints } from "../utils/random";
import { Knobs } from "./Dashboard";

export type RowData = { name: string; type: string; children?: RowData[] };
export type Group = { color: string; name: string };

const flattenRows = (
  rows: RowData[],
  nesting = 0,
  parentClosed = false
): {
  row: RowData;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
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
        },
        ...children,
      ];
    })
    .flat();

export const NestedRows = ({
  rows,
  groups,
  hoverState,
  knobs,
}: {
  rows: RowData[];
  hoverState: string | null;
  groups: Group[];
  knobs: Knobs;
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
          { row: { name }, nesting, childCount, isLastChild, hideBranches },
          i
        ) => (
          <ValueDistribution
            key={i}
            label={name}
            values={[
              { color: "grey", values: genDataPoints(name, 80, 10) },
              ...groups.map(({ color, name: orgName }) => ({
                color,
                values: genDataPoints(name + orgName, 32),
                showVariance: true,
                isHighlighted: hoverState === orgName,
              })),
            ]}
            nesting={nesting}
            childCount={childCount}
            isLastChild={isLastChild}
            hideBranches={hideBranches}
            knobs={knobs.valueDistribution}
            onToggleChildren={() => toggleOpen(i)}
            openState={openStates[i]}
          />
        )
      )}
    </React.Fragment>
  );
};
