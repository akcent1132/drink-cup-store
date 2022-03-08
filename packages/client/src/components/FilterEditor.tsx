/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Button as GButton, Select, TextInput } from "grommet";
import "../index.css";
import { withTheme } from "@emotion/react";
import { useCallback, useMemo, useState } from "react";
import { CROPS, COLORS, useFiltersContext } from "../contexts/FiltersContext";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`);

interface Props {}

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
  if (!filter) {
    return null;
  }
  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatchFilters({
        type: "updateName",
        filterId: filter.id,
        name: event.target.value,
      }),
    []
  );
  return (
    <Root>
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
      <GButton
        label="Close"
        onClick={() => dispatchFilters({ type: "select", filterId: null })}
      />
    </Root>
  );
};
