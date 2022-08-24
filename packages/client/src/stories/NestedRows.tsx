import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { findLastIndex, last } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { RowData } from "../contexts/rows";
import { Filter } from "../states/filters";
import { useHighlightedFilterId } from "../states/highlightedFilterId";
import { useHighlightedPlantingId } from "../states/highlightedPlantingId";
import { useSelectedCropType } from "../states/selectedCropType";
import { Stop } from "../states/tour";
import { TourStop } from "../states/TourStop";
import { getPlantingIdsOfFilter } from "../utils/getPlantingsOfFilter";
import { NestedRowsQuery, useNestedRowsQuery } from "./NestedRows.generated";

const getLabeledValues = (
  filters: Filter[],
  plantings: NestedRowsQuery["plantings"]
) => {
  console.time(`Get labeled values`);

  const plantingIdsOfFilters = filters.map((filter) =>
    getPlantingIdsOfFilter(filter, plantings)
  );

  // flat list of values from all plantings tagged with the matching filters
  const labeledValues = plantings
    .map((planting) => {
      const matchingFilters = filters
        .filter((_, idx) => plantingIdsOfFilters[idx].includes(planting.id))
        .map((filter) => ({ id: filter.id, color: filter.color }));
      return planting.values.map((value) => ({
        ...value,
        plantingId: planting.id,
        matchingFilters,
      }));
    })
    .flat();

  console.timeEnd(`Get labeled values`);
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
    matchingFilters: {
      id: string;
      color: string | null;
    }[];
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

      // mark the last immediate child
      const lastChild = last(children.filter((c) => c.nesting === nesting + 1));
      if (lastChild) {
        lastChild.isLastChild = true;
      }

      return [
        {
          row,
          nesting,
          childCount,
          isLastChild: false,
          hideBranches: 0,
          childRowNames,
          allData,
        },
        ...children,
      ];
    })
    .flat();

export const NestedRows = ({
  rows,
  filters,
}: {
  rows: RowData[];
  filters: Filter[];
}) => {
  const selectedCropType = useSelectedCropType();
  const { data, loading } = useNestedRowsQuery({
    variables: { cropType: selectedCropType },
  });
  const { plantings } = data || {};
  const highlightedPlantingId = useHighlightedPlantingId();
  const highlightedFilterId = useHighlightedFilterId();
  const labeledValues = useMemo(
    () => (filters && plantings ? getLabeledValues(filters, plantings) : []),
    [JSON.stringify(filters.map((f) => f.params)), plantings]
  );
  const flatRows = useMemo(
    () => flattenRows(rows, labeledValues),
    [rows, labeledValues]
  );
  const [isClosed, setIsClosed] = useState<{ [key: string]: boolean }>({});
  const getIsClosed = useCallback(
    (name: string) => {
      if (name in isClosed) {
        return isClosed[name];
      }
      // rows at the second level and below are closed by default
      return flatRows.find((r) => r.row.name === name)?.nesting === 1;
    },
    [flatRows, isClosed]
  );

  const toggleOpen = useCallback(
    (name: string) => {
      setIsClosed({ ...isClosed, [name]: !getIsClosed(name) });
    },
    [isClosed, getIsClosed]
  );
  const openStates = useMemo(() => {
    let closedAtLevel = -1;
    return flatRows.map(({ row: { name }, nesting }) => {
      if (closedAtLevel < 0) {
        if (getIsClosed(name)) {
          closedAtLevel = nesting;
          return "closed";
        } else {
          return "open";
        }
      } else {
        if (closedAtLevel < nesting) {
          return "parentClosed";
        } else if (getIsClosed(name)) {
          closedAtLevel = nesting;
          return "closed";
        } else {
          closedAtLevel = -1;
          return "open";
        }
      }
    });
  }, [flatRows, getIsClosed]);

  return (
    <>
      {loading ? (
        <Box mt={1}>
          <LinearProgress />
        </Box>
      ) : null}
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
        ) => {
          let row = (
            <ValueDistribution
              label={name}
              valueNames={showAggregation ? childRowNames : name}
              nesting={nesting}
              childCount={childCount}
              isLastChild={isLastChild}
              hideBranches={hideBranches}
              onToggleChildren={() => toggleOpen(name)}
              openState={openStates[i]!}
              highlightedFilterId={highlightedFilterId || undefined}
              highlightedPlantingId={highlightedPlantingId || undefined}
              allData={allData}
            />
          );
          if (i === 0) {
            row = (
              <TourStop stop={Stop.HOVER_VALUE} placement="right">
                {row}
              </TourStop>
            );
          }
          if (i === 1) {
            row = (
              <TourStop stop={Stop.OPEN_PLANTING} placement="bottom">
                {row}
              </TourStop>
            );
          }
          return <div key={`${name}-${i}`}>{row}</div>;
        }
      )}
    </>
  );
};
