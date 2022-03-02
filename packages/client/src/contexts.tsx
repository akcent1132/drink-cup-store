import React, { useContext, useReducer, useState } from "react";
import { PlantingData } from "./stories/NestedRows";

type HoveredPlantingAction = {
  type: "hover" | "leave";
  planting: PlantingData;
};
type HoveredPlantingState = PlantingData | null;
const hoveredPlantingReducer = (
  state: HoveredPlantingState,
  action: HoveredPlantingAction
) => {
  switch (action.type) {
    case "hover":
      return action.planting;
    case "leave":
      return state && state.id === action.planting.id ? null : state;
  }
};

const HoveredPlantingContext =
  React.createContext<
    [HoveredPlantingState, (action: HoveredPlantingAction) => void]
  >([null, () => {}]);

export const HoveredPlantingProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const state = useReducer(hoveredPlantingReducer, null);
  return (
    <HoveredPlantingContext.Provider value={state}>
      {children}
    </HoveredPlantingContext.Provider>
  );
};

export const useHoveredPlantingContext = () => useContext(HoveredPlantingContext)
