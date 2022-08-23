import styled from "@emotion/styled";
import { ROWS } from "../../contexts/rows";
import { useFilters } from "../../states/filters";
import { Stop } from "../../states/tour";
import { TourStop } from "../../states/TourStop";
import { CropSelector } from "../../stories/CropSelector";
import { NestedRows } from "../../stories/NestedRows";
import { Spacer } from "../EventsCard";
import { FilterLabel } from "../FilterLabel";
import { AddFilterButton } from "./AddFilterButton";

const PaneHead = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 20px 20px 20px;
`;

export const CompareTab = () => {
  const filters = useFilters();

  return (
    <RowContainer>
      <PaneHead>
        <TourStop stop={Stop.SELECT_CROP}>
          <CropSelector />
        </TourStop>
        <Spacer />
        {[...filters].reverse().map((filter) => (
          <FilterLabel
            key={filter.id}
            filterId={filter.id}
            label={filter.name}
            color={filter.color}
          />
        ))}
        <AddFilterButton />
      </PaneHead>
      <NestedRows rows={ROWS} filters={filters} />
    </RowContainer>
  );
};
