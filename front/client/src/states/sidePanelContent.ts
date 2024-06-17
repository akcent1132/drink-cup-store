import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

type SidePanelContent = {
  plantingIds: string[];
} & (
  | {
      type: "FilterEditor";
      filterId: string;
    }
  | {
      type: "PlantingCards";
    }
  | {
      type: "Profile";
      producerId: string;
    }
);

const sidePanelContent = atom<SidePanelContent>({
  key: "side-panel-content",
  default: {
    type: "PlantingCards",
    plantingIds: [],
  },
});

export const useSidePanelContent = () => useRecoilValue(sidePanelContent);
export const useShowProfile = () => {
  const set = useSetRecoilState(sidePanelContent);
  return useCallback(
    (producerId: string) =>
      set((state) => ({ ...state, type: "Profile", producerId })),
    []
  );
};
export const useShowFilterEditor = () => {
  const set = useSetRecoilState(sidePanelContent);
  return useCallback(
    (filterId: string) =>
      set((state) => ({ ...state, type: "FilterEditor", filterId })),
    []
  );
};
export const useShowPlantingCards = () => {
  const set = useSetRecoilState(sidePanelContent);
  return useCallback(
    () => set((state) => ({ ...state, type: "PlantingCards" })),
    []
  );
};
export const useAddPlantingCard = () => {
  const set = useSetRecoilState(sidePanelContent);
  return useCallback(
    (plantingId) =>
      set((state) => {
        if (!state.plantingIds.includes(plantingId)) {
          return { ...state, plantingIds: [plantingId, ...state.plantingIds] };
        }
        return state;
      }),

    []
  );
};
export const useRemovePlantingCard = () => {
  const set = useSetRecoilState(sidePanelContent);
  return useCallback(
    (plantingId) =>
      set((state) => {
        if (state.plantingIds.includes(plantingId)) {
          return {
            ...state,
            plantingIds: state.plantingIds.filter((id) => id !== plantingId),
          };
        }
        return state;
      }),
    []
  );
};
