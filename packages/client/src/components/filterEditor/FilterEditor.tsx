/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { Text } from "grommet";
import { css, withTheme } from "@emotion/react";
import React, { useCallback, useMemo } from "react";
import { TagSelect } from "./TagSelect";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "../EventsCard";
import { useFilterEditorQuery } from "./FilterEditor.generated";
import { FilterParamSelector } from "./FilterParamSelector";
import { RangeSlider } from "./RangeSlider";
import {
  getFilterables,
  isNumericFilterable,
  isOptionFilterable,
} from "./getFilterables";
import { useShowPlantingCards } from "../../states/sidePanelContent";
import {
  isOptionFilterParam,
  isRangeFilterParam,
  useEditFilterParam,
  useFilters,
  useUpdateFilterName,
} from "../../states/filters";
import { useSelectedCropType } from "../../states/selectedCropType";
import LinearProgress from "@mui/material/LinearProgress";
import { prettyKey } from "./prettyKey";
import { InputActionsWrap } from "./InputActionsWrap";
import TextField from "@mui/material/TextField";

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
