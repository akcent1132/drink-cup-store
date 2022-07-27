/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { TextInput, Text } from "grommet";
import { css, withTheme } from "@emotion/react";
import React, { useCallback, useMemo } from "react";
import { throttle } from "lodash";
import { TagSelect } from "./TagSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "../EventsCard";
import { useFilterEditorQuery } from "./FilterEditor.generated";
import { FilterParamSelector } from "./FilterParamSelector";
import { RangeSlider } from "./RangeSlider";
import { Filterable, FilterableOption, getFilterables } from "./getFilterables";
import { useShowPlantingCards } from "../../states/sidePanelContent";
import {
  FilterValueRange,
  isOptionFilterParam,
  isRangeFilterParam,
  useEditFilterParam,
  useFilters,
  useUpdateFilterName,
} from "../../states/filters";
import { useSelectedCropType } from "../../states/selectedCropType";
import LinearProgress from "@mui/material/LinearProgress";
import { prettyKey } from "./prettyKey";

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
const isOptionFilterable = (
  filterable: Filterable
): filterable is FilterableOption => {
  return filterable.type === "option";
};

/**
 * Primary UI component for user interaction
 */
export const FilterEditor = ({ selectedFilterId }: Props) => {
  const filters = useFilters();
  const showPlantingCards = useShowPlantingCards();
  const selectedCropType = useSelectedCropType();
  const filter = useMemo(
    () => filters.find((filter) => filter.id === selectedFilterId),
    [selectedFilterId, filters]
  );
  const updateFilterName = useUpdateFilterName();
  const editFilterParam = useEditFilterParam();
  const { data: { plantings } = {} } = useFilterEditorQuery({
    variables: { cropType: selectedCropType },
  });

  const filterables = useMemo(
    () => getFilterables(plantings || []),
    [plantings && plantings.map((p) => p.id).join()]
  );
  const handleClose = useCallback(() => filter && showPlantingCards(), []);
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
            {params.map((param) => {
              const filterable = filterables.find(
                (f) => f.key === param.key && f.dataSource === param.dataSource
              );
              return isOptionFilterParam(param) &&
                (!filterable || isOptionFilterable(filterable)) ? (
                <TagSelect
                  filterId={selectedFilterId}
                  filterable={filterable}
                  param={param}
                />
              ) : isRangeFilterParam(param) ? (
                <Label label={prettyKey(param.key)} key={param.key}>
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
                </Label>
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
