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
import { css, withTheme } from "@emotion/react";
import React, { useCallback } from "react";
import { capitalize, first, last, range, throttle } from "lodash";
import { TagSelect } from "../TagSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "../EventsCard";
import {
  applyDraftFilter,
  editFilterParam,
  selectFilter,
  updateFilterName,
} from "../../contexts/FiltersContext";
import { useFilterEditorQuery } from "./FilterEditor.generated";
import { FilterValueOption, FilterValueRange } from "../../graphql.generated";
import { FilterParamSelector } from "./FilterParamSelector";

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

const ThinRangeInput = ({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number[];
  onChange: (bounds: number[]) => void;
}) => (
  <Box gap="small">
    <Stack>
      <Box background="light-4" height="6px" direction="row" />
      <RangeSelector
        direction="horizontal"
        min={min}
        max={max}
        // step={1}
        values={value}
        onChange={(values) => onChange(values)}
      />
    </Stack>
    <Box align="center">
      <Text size="small">{`${value[0]} - ${value[1]}`}</Text>
    </Box>
  </Box>
);

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({ selectedFilterId }: Props) => {
  const { data: { filter } = {} } = useFilterEditorQuery({
    variables: { filterId: selectedFilterId },
  });
  // const handleApply = useCallback(
  //   () => {}, //filter && applyDraftFilter(filter.id),
  //   [filter?.id]
  // );
  const handleClose = useCallback(() => filter && selectFilter(null), []);
  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      filter && updateFilterName(filter.id, event.target.value),
    [filter?.id]
  );
  // const updateYears = useCallback(
  //   ([from, to]) =>
  //     filter && editFilter(filter.id, { years: range(from, to + 1) }),
  //   [filter?.id]
  // );
  // const updateSweetnessScore = useCallback(
  //   ([from, to]) =>
  //     filter && editFilter(filter.id, { sweetnessScore: range(from, to + 1) }),
  //   [filter?.id]
  // );
  // const updateFlavorScore = useCallback(
  //   ([from, to]) =>
  //     filter && editFilter(filter.id, { flavorScore: range(from, to + 1) }),
  //   [filter?.id]
  // );
  // const updateTasteScore = useCallback(
  //   ([from, to]) =>
  //     filter && editFilter(filter.id, { tasteScore: range(from, to + 1) }),
  //   [filter?.id]
  // );
  // const updateParams = useCallback(
  //   (params) => filter && editFilter(filter.id, params),
  //   [filter?.id]
  // );
  const params = filter?.params;
  if (!params) {
    return null;
  }
  console.log("PARAMS", params)

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
        <FilterParamSelector filterId={filter.id} params={params} />
        {params.map((param) =>
          !param.active ? null : (
            <Label label={capitalize(param.key)} key={param.key}>
              {param.value.__typename === "FilterValueOption" ? (
                <TagSelect
                  onChange={(options) =>
                    editFilterParam(filter.id, param.key, {
                      ...(param.value as FilterValueOption),
                      options,
                    })
                  }
                  value={param.value.options}
                  options={param.value.allOptions}
                  allowSearch
                />
              ) : (
                <ThinRangeInput
                  min={Math.min(...param.value.values) || 0}
                  max={Math.max(...param.value.values) || 0}
                  value={[param.value.min, param.value.max]}
                  onChange={throttle(([min, max]) =>
                    editFilterParam(filter.id, param.key, {
                      ...(param.value as FilterValueRange),
                      min,
                      max,
                    }), 345)
                  }
                />
              )}
            </Label>
          )
        )}

        {/* <Label label="Types">
          <TagSelect
            onChange={(types) => updateParams({ types })}
            value={params.types}
            options={TYPES}
            allowSearch
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
        <Label label="Flags">
          <TagSelect
            onChange={(flags) => updateParams({ flags })}
            value={params.flags}
            options={FLAGS}
            allowSearch
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
          label="Weed Control"
          min={10}
          max={17}
          value={params.sweetnessScore}
          onChange={updateSweetnessScore}
        />
        <RangeInput
          label="Pest-Disease Control"
          min={0}
          max={7}
          value={params.flavorScore}
          onChange={updateFlavorScore}
        />
        <RangeInput
          label="Tillage"
          min={1}
          max={9}
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
        <Label label="Hardiness Zones">
          <TagSelect
            onChange={(zones) => updateParams({ zones })}
            value={params.zones}
            options={ZONES}
          />
        </Label> */}
        {/* <GButton label="Update" onClick={handleApply} /> */}
      </Body>
    </Root>
  );
};
