import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const highlightedFilterId = atom<null | string>({
  key: "highlighted-filter-id",
  default: null,
});

export const useHighlightedFilterId = () =>
  useRecoilValue(highlightedFilterId);

export const useHighlightFilter = () => {
  const set = useSetRecoilState(highlightedFilterId);
  return useCallback((filterId: string) => set(filterId), []);
};

export const useUnhighlightFilter = () => {
  const set = useSetRecoilState(highlightedFilterId);
  return useCallback(
    (filterId: string) =>
      set((current) => (current === filterId ? null : current)),
    []
  );
};
