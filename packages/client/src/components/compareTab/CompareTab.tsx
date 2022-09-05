import styled from "@emotion/styled";
import { useFilters } from "../../states/filters";
import { Stop } from "../../states/tour";
import { TourStop } from "../../states/TourStop";
import { CropSelector } from "../../stories/CropSelector";
import { NestedRows } from "../../stories/NestedRows";
import { Spacer } from "../plantingCards/PlantingCard";
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

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
`;

export const CompareTab = () => {
  const filters = useFilters();

  return (
    <RowContainer>
      <PaneHead>
        <TourStop stop={Stop.SELECT_CROP} placement="right">
          <CropSelector />
        </TourStop>
        <Spacer />
        <LabelContainer>
          {[...filters].reverse().map((filter) => (
            <FilterLabel
              key={filter.id}
              filterId={filter.id}
              label={filter.name}
              color={filter.color}
            />
          ))}
        </LabelContainer>
        <TourStop stop={Stop.FILTER} placement="bottom-start">
          <AddFilterButton />
        </TourStop>
      </PaneHead>

      <NestedRows filters={filters} />
    </RowContainer>
  );
};
