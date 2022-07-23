/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Box, RangeSelector, Stack, TextInput, Text } from "grommet";
import { css, withTheme } from "@emotion/react";
import React, { useCallback, useMemo } from "react";
import { capitalize, range, throttle, zipWith } from "lodash";
import { TagSelect } from "./TagSelect";
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
import { getFilterables } from "./getFilterables";
import { useFilters } from "../../contexts/FiltersCtx";

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

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({ selectedFilterId }: Props) => {
  const filtersCtx = useFilters();
  const filter = useMemo(
    () => filtersCtx.filters.find((filter) => filter.id === selectedFilterId),
    [selectedFilterId, filtersCtx.filters]
  );
  const { data: { plantings } = {} } = useFilterEditorQuery({
    variables: { cropType: filter?.cropType },
  });

  const filterables = useMemo(
    () => getFilterables(plantings || []),
    [plantings && plantings.map((p) => p.id).join()]
  );
  console.log({ filterables });
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
        <FilterParamSelector
          filterId={filter.id}
          filterables={filterables}
          params={params}
        />
        <Label label="Name">
          <TextInput
            placeholder="Filter name"
            value={filter.name}
            onChange={updateName}
          />
        </Label>
        {params.map((param) => {
          const filterable = filterables.find(
            (f) => f.key === param.key && f.dataSource === param.dataSource
          );
          return (
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
                  options={
                    (filterable?.type === "option" &&
                      filterable.options.map(({ value, occurences }) => ({
                        value,
                        label: `${value} (${occurences})`,
                      }))) ||
                    []
                  }
                  allowSearch
                />
              ) : (
                <RangeSlider
                  value={[param.value.min, param.value.max]}
                  allValues={
                    (filterable?.type === "numeric" &&
                      filterable.values.length > 1 &&
                      filterable.values) || [
                      param.value.min / 2,
                      param.value.max * 2,
                    ]
                  }
                  onChange={throttle(
                    ([min, max]) =>
                      editFilterParam(filter.id, param.key, {
                        ...(param.value as FilterValueRange),
                        min,
                        max,
                      }),
                    128
                  )}
                />
              )}
            </Label>
          );
        })}
      </Body>
    </Root>
  );
};
