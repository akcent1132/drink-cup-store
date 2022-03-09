/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import {
  Box,
  Button as GButton,
  RangeSelector,
  Select,
  Stack,
  TextInput,
  Text,
} from "grommet";
import "../index.css";
import { withTheme } from "@emotion/react";
import { useCallback, useMemo, useState } from "react";
import { CROPS, COLORS, useFiltersContext } from "../contexts/FiltersContext";
import { range, values } from "lodash";

const Root = withTheme(styled.div<{ color: string }>`
  border-right: 10px solid ${(p) => p.color};
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`);

interface Props {}
const YEAR_MIN = 2017;
const YEAR_MAX = 2022;

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({}: Props) => {
  const [crop, setCrop] = useState(CROPS[0]);

  const [{ filters, selectedFilterId }, dispatchFilters] = useFiltersContext();
  const filter = useMemo(
    () => filters.find((f) => f.id === selectedFilterId),
    [filters, selectedFilterId]
  );
  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      filter &&
      dispatchFilters({
        type: "updateName",
        filterId: filter.id,
        name: event.target.value,
      }),
    [!filter]
  );
  const updateYears = useCallback(
    ([from, to]) =>
      filter &&
      dispatchFilters({
        type: "edit",
        filterId: filter.id,
        params: { years: range(from, to + 1) },
      }),
    [!filter]
  );
  const params = filter?.draftParams || filter?.activeParams;
  if (!params) {
    return null;
  }
  
  return (
    <Root color={filter.color}>
      <TextInput
        placeholder="Filter name"
        value={filter.name}
        onChange={updateName}
      />
      <Select
        placeholder="Select a crop"
        value={crop}
        options={CROPS}
        onChange={({ value }) => setCrop(value)}
        clear
      />
      <Stack>
        <Box direction="row" justify="between">
          {range(YEAR_MIN, YEAR_MAX+1).map((value) => (
            <Box key={value} pad="small" border={false}>
              <Text style={{ fontFamily: "monospace" }}>{value}</Text>
            </Box>
          ))}
        </Box>
        <RangeSelector
          direction="horizontal"
          invert={false}
          min={YEAR_MIN}
          max={YEAR_MAX}
          size="full"
          round="small"
          values={[Math.min(...params.years), Math.max(...params.years)]}
          onChange={(values) => updateYears(values)}
        />
      </Stack>
      <GButton
        label="Close"
        onClick={() => dispatchFilters({ type: "select", filterId: null })}
      />
    </Root>
  );
};
