/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import {
  Box,
  RangeSelector,
  Stack,
  TextInput,
  Text,
} from "grommet";
import { css, withTheme } from "@emotion/react";
import React, { useCallback } from "react";
import { capitalize, range, throttle } from "lodash";
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
import { RangeSlider } from "./RangeSlider";

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

  const params = filter?.params;
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
                <RangeSlider
                  min={Math.min(...param.value.values) || 0}
                  max={Math.max(...param.value.values) || 0}
                  value={[param.value.min, param.value.max]}
                  allValues={param.value.values}
                  onChange={throttle(([min, max]) =>
                    editFilterParam(filter.id, param.key, {
                      ...(param.value as FilterValueRange),
                      min,
                      max,
                    }), 128)
                  }
                />
              )}
            </Label>
          )
        )}
      </Body>
    </Root>
  );
};
