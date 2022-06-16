import { findLastIndex, last } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { RowData } from "../contexts/rows";
import { NestedRowsQuery, useNestedRowsQuery } from "./NestedRows.generated";

const flattenRows = (
  rows: RowData[],
  groupedValues: NestedRowsQuery["groupedValues"],
  nesting = 0
): {
  row: RowData;
  nesting: number;
  childCount: number;
  isLastChild: boolean;
  hideBranches: number;
  childRowNames: string[];
  allData: {
    filter:
      | {
          id: string;
          color: string;
        }
      | null
      | undefined;
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
        groupedValues,
        nesting + 1
      );
      const childCount = children
        ? findLastIndex(children, { nesting: nesting + 1 }) + 1
        : 0;
      children.slice(childCount).forEach((child) => (child.hideBranches += 1));

      const childRowNames = children.map((c) => c.row.name);
      const { name, showAggregation } = row;
      const valueNames = showAggregation ? childRowNames : [name];
      const allData = (groupedValues || [])
        .map((v) => {
          return v.values
            .filter((v) => valueNames.includes(v.name))
            .map((data) => ({ ...data, filter: v.filter }));
        })
        .flat();

      if (allData.length === 0 && children.every(c => c.allData.length === 0)) {
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
  const query = useNestedRowsQuery();
  const flatRows = useMemo(
    () =>
      flattenRows(rows, query?.data?.groupedValues || []),
    [rows, query?.data?.groupedValues]
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
            queryResult={query}
            allData={allData}
          />
        )
      )}
    </React.Fragment>
  );
};
