/** @jsxImportSource @emotion/react */

import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import React, { useCallback, useMemo } from "react";
import {
  isOptionFilterParam,
  isRangeFilterParam,
  useFilters,
  useUpdateFilterName,
} from "../../states/filters";
import { useSelectedCropType } from "../../states/selectedCropType";
import { Spacer } from "../plantingCards/PlantingCard";
import { useFilterEditorQuery } from "./FilterEditor.generated";
import { FilterMenu } from "./FilterMenu";
import { FilterParamSelector } from "./FilterParamSelector";
import {
  getFilterables,
  isNumericFilterable,
  isOptionFilterable,
} from "./getFilterables";
import { InputActionsWrap } from "./InputActionsWrap";
import { RangeSlider } from "./RangeSlider";
import { TagSelect } from "./TagSelect";

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
  const filters = useFilters();
  const selectedCropType = useSelectedCropType();
  const filter = useMemo(
    () => filters.find((filter) => filter.id === selectedFilterId),
    [selectedFilterId, filters]
  );
  const updateFilterName = useUpdateFilterName();
  const { plantings } =
    useFilterEditorQuery({
      variables: { cropType: selectedCropType },
    }).data || {};

  const filterables = useMemo(
    () => getFilterables(plantings || []),
    [plantings && plantings.map((p) => p.id).join()]
  );

  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      filter && updateFilterName(filter.id, event.target.value),
    [filter?.id]
  );

  const params = filter?.params;

  return (
    <Root>
      {!params ? (
        <LinearProgress />
      ) : (
        <>
          <Header color={filter.color}>
            <Title>Filter options</Title>
            <Spacer />
            <FilterMenu filterId={filter.id} />
          </Header>
          <Body>
            <TextField
              label="Filter Name"
              variant="outlined"
              value={filter.name}
              onChange={updateName}
            />
            {params.map((param) => {
              const filterable = filterables.find(
                (f) => f.key === param.key && f.dataSource === param.dataSource
              );
              return isOptionFilterParam(param) &&
                (!filterable || isOptionFilterable(filterable)) ? (
                <InputActionsWrap
                  key={param.key}
                  filterId={selectedFilterId}
                  paramKey={param.key}
                >
                  <TagSelect
                    filterId={selectedFilterId}
                    filterable={filterable}
                    param={param}
                  />
                </InputActionsWrap>
              ) : isRangeFilterParam(param) &&
                (!filterable || isNumericFilterable(filterable)) ? (
                <InputActionsWrap
                  key={param.key}
                  filterId={selectedFilterId}
                  paramKey={param.key}
                >
                  <RangeSlider
                    filterId={selectedFilterId}
                    filterable={filterable}
                    param={param}
                  />
                </InputActionsWrap>
              ) : null;
            })}

            <FilterParamSelector
              filterId={filter.id}
              filterables={filterables}
              params={params}
            />
          </Body>
        </>
      )}
    </Root>
  );
};
