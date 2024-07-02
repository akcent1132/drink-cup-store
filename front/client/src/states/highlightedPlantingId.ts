import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const highlightedPlantingId = atom<null | string>({
  key: "highlighted-planting-id",
  default: null,
});

export const useHighlightedPlantingId = () =>
  useRecoilValue(highlightedPlantingId);

export const useHighlightPlanting = () => {
  const set = useSetRecoilState(highlightedPlantingId);
  return useCallback((plantingId: string) => set(plantingId), []);
};

export const useUnhighlightPlanting = () => {
  const set = useSetRecoilState(highlightedPlantingId);
  return useCallback(
    (plantingId: string) =>
      set((current) => (current === plantingId ? null : current)),
    []
  );
};
