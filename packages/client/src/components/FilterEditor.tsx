/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import {
  Box,
  Button as GButton,
  RangeSelector,
  Stack,
  TextInput,
  Text,
} from "grommet";
import "../index.css";
import { css, withTheme } from "@emotion/react";
import React, { useCallback } from "react";
import {
  COLORS,
  AMENDMENTS,
  CLIMATE_REGION,
  FARM_PRACTICES,
  LAND_PREPARATION,
  SAMPLE_SOURCE,
  GROUPS,
} from "../contexts/lists";
import { range } from "lodash";
import { TagSelect } from "./TagSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "./EventsCard";
import {
  applyDraftFilter,
  editFilter,
  selectFilter,
  updateFilterName,
} from "../contexts/FiltersContext";
import { useFilterEditorQuery } from "./FilterEditor.generated";

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

export const Label = ({
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
  // background-color: ${(p) => p.color};
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

interface Props {
  selectedFilterId: string;
}
const YEAR_MIN = 2017;
const YEAR_MAX = 2022;

const RangeInput = ({
  min,
  max,
  value,
  label,
  onChange,
}: {
  min: number;
  max: number;
  value: number[];
  label: string;
  onChange: (bounds: number[]) => void;
}) => (
  <Label label={label}>
    <Stack>
      <Box direction="row" justify="between">
        {range(min, max + 1).map((value) => (
          <Box key={value} pad="small" border={false}>
            <Text style={{ fontFamily: "monospace" }}>{value}</Text>
          </Box>
        ))}
      </Box>
      <RangeSelector
        direction="horizontal"
        invert={false}
        min={min}
        max={max}
        size="full"
        round="small"
        values={[Math.min(...value), Math.max(...value)]}
        onChange={(values) => onChange(values)}
      />
    </Stack>
  </Label>
);

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({ selectedFilterId }: Props) => {
  const { data: { filter } = {} } = useFilterEditorQuery({
    variables: { filterId: selectedFilterId },
  });
  const handleClose = useCallback(() => filter && applyDraftFilter(filter.id), [filter?.id]);
  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      filter && updateFilterName(filter.id, event.target.value),
    [filter?.id]
  );
  const updateYears = useCallback(
    ([from, to]) =>
      filter && editFilter(filter.id, { years: range(from, to + 1) }),
    [filter?.id]
  );
  const updateSweetnessScore = useCallback(
    ([from, to]) =>
      filter && editFilter(filter.id, { sweetnessScore: range(from, to + 1) }),
    [filter?.id]
  );
  const updateFlavorScore = useCallback(
    ([from, to]) =>
      filter && editFilter(filter.id, { flavorScore: range(from, to + 1) }),
    [filter?.id]
  );
  const updateTasteScore = useCallback(
    ([from, to]) =>
      filter && editFilter(filter.id, { tasteScore: range(from, to + 1) }),
    [filter?.id]
  );
  const updateParams = useCallback(
    (params) => filter && editFilter(filter.id, params),
    [filter?.id]
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
        <RangeInput
          label="Years"
          min={YEAR_MIN}
          max={YEAR_MAX}
          value={params.years}
          onChange={updateYears}
        />
        <Label label="Groups">
          <TagSelect
            onChange={(groups) => updateParams({ groups })}
            value={params.groups}
            options={GROUPS}
            allowSearch
          />
        </Label>
        <Label label="Colors">
          <TagSelect
            onChange={(colors) => updateParams({ colors })}
            value={params.colors}
            options={COLORS}
          />
        </Label>
        <Label label="Climate Region">
          <TagSelect
            onChange={(climateRegion) => updateParams({ climateRegion })}
            value={params.climateRegion}
            options={CLIMATE_REGION}
          />
        </Label>
        <Label label="Sample Source">
          <TagSelect
            onChange={(sampleSource) => updateParams({ sampleSource })}
            value={params.sampleSource}
            options={SAMPLE_SOURCE}
          />
        </Label>
        <RangeInput
          label="Sweetness Score"
          min={1}
          max={10}
          value={params.sweetnessScore}
          onChange={updateSweetnessScore}
        />
        <RangeInput
          label="Flavor Score"
          min={1}
          max={10}
          value={params.flavorScore}
          onChange={updateFlavorScore}
        />
        <RangeInput
          label="Taste Score"
          min={1}
          max={10}
          value={params.tasteScore}
          onChange={updateTasteScore}
        />
        <Label label="Farm Practices">
          <TagSelect
            onChange={(farmPractices) => updateParams({ farmPractices })}
            value={params.farmPractices}
            options={FARM_PRACTICES}
          />
        </Label>
        <Label label="Amendments">
          <TagSelect
            onChange={(amendments) => updateParams({ amendments })}
            value={params.amendments}
            options={AMENDMENTS}
          />
        </Label>
        <Label label="Land Preparation">
          <TagSelect
            onChange={(landPreparation) => updateParams({ landPreparation })}
            value={params.landPreparation}
            options={LAND_PREPARATION}
          />
        </Label>
        <GButton label="Update" onClick={handleClose} />
      </Body>
    </Root>
  );
};
