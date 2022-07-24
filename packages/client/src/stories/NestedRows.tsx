import { findLastIndex, last, remove } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { ValueDistribution } from "../components/ValueDistribution";
import { Filter, useFilters } from "../contexts/FiltersCtx";
import { RowData } from "../contexts/rows";
import { FilterParamDataSource } from "../graphql.generated";
import { useHightlightedPlantingId } from "../states/highlightedPlantingId";
import { NestedRowsQuery, useNestedRowsQuery } from "./NestedRows.generated";

type Planting = NestedRowsQuery["plantings"][number];

// TODO caching
const isMatchingFarmOnboardingValue = (
  planting: Planting,
  param: Filter["params"][number]
) => {
  // values of this planting
  const values =
    (planting.farmOnboarding?.values || []).find((v) => v.key === param.key)
      ?.values || [];
  const paramValue = param.value;
  if (paramValue.__typename === "FilterValueOption") {
    return paramValue.options.some((option) => values.includes(option));
  } else {
    const numValues = values
      .map((v) => Number.parseFloat(v))
      .filter((v) => Number.isFinite(v));
    // don't filter if the planting has no value for this property
    if (numValues.length === 0) {
      return true;
    }
    return numValues.some((v) => v >= paramValue.min && v <= paramValue.max);
  }
};

// Matching rules:
// - Range values match if
//   - planting has any value (with the given key) in the given range
//   - planting has no value with the given key
// - Option values match
//   - if the planting has a matching value (with the given key) with the selected option
const getPlantingIdsOfFilter = (filter: Filter, plantings: Planting[]) => {
  console.time(`getPlantingsOfFilter ${filter.id}`);

  const activeParams = filter.params.filter((p) => p.active);
  let filteredPlantings = plantings;

  if (activeParams.length === 0) {
    filteredPlantings = [];
  } else {
    for (const param of activeParams) {
      if (param.dataSource === FilterParamDataSource.FarmOnboarding) {
        filteredPlantings = filteredPlantings.filter((planting) =>
          isMatchingFarmOnboardingValue(planting, param)
        );
      } else {
        const paramValue = param.value;
        if (paramValue.__typename === "FilterValueRange") {
          filteredPlantings = filteredPlantings.filter((planting) => {
            const values = planting.values.filter(
              (value) => value.name === param.key
            );
            return (
              values.length === 0 ||
              values.some(
                ({ value }) =>
                  value >= paramValue.min && value <= paramValue.max
              )
            );
          });
        }
      }
    }
  }

  console.timeEnd(`getPlantingsOfFilter ${filter.id}`);

  return filteredPlantings.map((p) => p.id);
};

const getLabeledValues = (
  filters: Filter[],
  plantings: NestedRowsQuery["plantings"]
) => {
  console.time(`Get labeled values`);

  const plantingIdsOfFilters = filters.map((filter) =>
    getPlantingIdsOfFilter(filter, plantings)
  );
  const matchedPlantingIds = plantingIdsOfFilters.flat();
  const unmatchedPlantings = plantings.filter(
    (p) => !matchedPlantingIds.includes(p.id)
  );

  const _labeledValues = [
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
  const { data: { selectedCropType, plantings, highlightedFilterId } = {} } =
    useNestedRowsQuery();
  const filtersCtx = useFilters();
  const filters = useMemo(
    () => filtersCtx.filters.filter((f) => f.cropType === selectedCropType),
    [filtersCtx.filters, selectedCropType]
  );
  const { highlightedPlantingId } = useHightlightedPlantingId();
  const labeledValues = useMemo(
    () => (filters && plantings ? getLabeledValues(filters, plantings) : []),
    [filters, plantings]
  );
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
