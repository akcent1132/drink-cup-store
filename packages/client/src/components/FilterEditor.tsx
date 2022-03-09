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
import { css, withTheme } from "@emotion/react";
import React, { useCallback, useMemo, useState } from "react";
import { CROPS, COLORS, useFiltersContext } from "../contexts/FiltersContext";
import { range } from "lodash";
import { TagSelect } from "./TagSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "./EventsCard";

const Root = withTheme(styled.div`
  background-color: ${(p) => p.theme.colors.bgSidePanel};
  display: flex;
  flex-direction: column;
`);

const Body = withTheme(styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
`);

const Label = ({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      margin: 1px 0;
    `}
  >
    <Text
      css={css`
        color: rgba(255, 255, 255, 0.5);
        margin-left: 12px;
        font-size: 15px;
        font-weight: 500;
      `}
    >
      {label}
    </Text>
    {children}
  </div>
);

const Header = withTheme(styled.div<{ color: string }>`
  background-color: ${(p) => p.color};
  display: flex;
  font-family: ${(p) => p.theme.font};
  font-size: 19px;
  padding: 8px 14px;
`);

const Title = withTheme(styled.div`
  font-weight: 600;
  color: white;
`);

export const IconButton = styled.div`
  color: white;
  cursor: pointer;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  margin-left: 10px;
  display: flex;
  align-content: center;
`;

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
  const handleClose = useCallback(
    () => dispatchFilters({ type: "select", filterId: null }),
    []
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
  const updateColors = useCallback(
    (colors: string[]) =>
      filter &&
      dispatchFilters({
        type: "edit",
        filterId: filter.id,
        params: { colors },
      }),
    [!filter]
  );
  const params = filter?.draftParams || filter?.activeParams;
  if (!params) {
    return null;
  }

  return (
    <Root>
      <Header color={filter.color}>
        <Title>Filter options</Title>
        <Spacer />
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="inherit" color="inherit" />
        </IconButton>
      </Header>
      <Body>
        <Label label="Name">
          <TextInput
            placeholder="Filter name"
            value={filter.name}
            onChange={updateName}
          />
        </Label>
        <Label label="Crop type">
          <Select
            placeholder="Select a crop"
            value={crop}
            options={CROPS}
            onChange={({ value }) => setCrop(value)}
            clear
          />
        </Label>
        <Label label="Years">
          <Stack>
            <Box direction="row" justify="between">
              {range(YEAR_MIN, YEAR_MAX + 1).map((value) => (
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
        </Label>
        <Label label="Colors">
          <TagSelect
            onChange={updateColors}
            value={params.colors}
            options={COLORS}
          />
        </Label>
        <GButton label="Update" onClick={handleClose} />
      </Body>
    </Root>
  );
};
