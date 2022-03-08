/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Button as GButton, Select } from "grommet";
import "../index.css";
import { withTheme } from "@emotion/react";
import { useState } from "react";
import { CROPS, COLORS, useFiltersContext } from "../contexts/FiltersContext";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  width: 100%;
  padding: 12px;
`);

interface Props {}

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({}: Props) => {
    const [crop, setCrop] = useState(CROPS[0])
    const [{filters}, dispatchFilters] = useFiltersContext();
  return (
    <Root>
      <Select
        placeholder="Select a crop"
        value={crop}
        options={CROPS}
        onChange={({ value }) => setCrop(value)}
        clear
      />
      <GButton  label="Close" onClick={() => dispatchFilters({type: "select", filterId: null})} />
    </Root>
  );
};

