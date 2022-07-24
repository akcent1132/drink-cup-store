import { useReactiveVar } from "@apollo/client";
import React, { useContext, useState } from "react";
import { filters as filtersVar } from "./FiltersContext";

type RightSideContext = {
  type: "FilterEditor",
  filterId: string
}

const HighlightedPlantingIdCtx = React.createContext<null|string>(null);
const HighlightedFilterIdCtx = React.createContext<null|string>(null);
const SelectedCropTypeCtx = React.createContext<null|string>(null);
const OpenEventCardIdsCtx = React.createContext<null|string>(null);
const SelectedFilterIdCtx = React.createContext<null|string>(null);
const SelectedProducerIdCtx = React.createContext<null|string>(null);

const useHighlightedPlantingId = () => useContext(HighlightedPlantingIdCtx);
const useHighlightedFilterId = () => useContext(HighlightedFilterIdCtx);
const useSelectedCropType = () => useContext(SelectedCropTypeCtx);
const useOpenEventCardIds = () => useContext(OpenEventCardIdsCtx);
const useSelectedFilterId = () => useContext(SelectedFilterIdCtx);
const useSelectedProducerId = () => useContext(SelectedProducerIdCtx);

export const FiltersProvider: React.FC = (props) => {
  const highlightedPlantingId = useState<null|string>(null);
  const highlightedFilterId = useState<null|string>(null);
  const selectedCropType = useState<null|string>(null);
  const openEventCardIds = useState<string[]>([]);
  const selectedFilterId = useState<null|string>(null);
  const selectedProducerId = useState<null|string>(null);

  return (
    <FiltersCtx.Provider value={{ filters }}>
      {props.children}
    </FiltersCtx.Provider>
  );
};
