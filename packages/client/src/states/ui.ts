import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

const highlightedPlantingId = atom<null | string>({
  key: "highlighted-planting-id",
  default: null,
});
export const useHightlightedPlantingId = () => {
  const [state, setState] = useRecoilState(highlightedPlantingId);
  const hightlightPlanting = useCallback((plantingId: string) => {
    console.log("H PLANTING", plantingId)
    setState(plantingId);
  }, []);
  const unhightlightPlanting = useCallback(
    (plantingId: string) => {
      if (plantingId === state) setState(null);
    },
    [state]
  );
  return {
    highlightedPlantingId: state,
    hightlightPlanting,
    unhightlightPlanting,
  };
};
