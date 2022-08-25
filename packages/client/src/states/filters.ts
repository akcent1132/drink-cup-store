import { schemeTableau10 } from "d3-scale-chromatic";
import { sample, without } from "lodash";
import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export type Filter = {
  color: string;
  id: string;
  name: string;
  params: FilterParam[];
};

export type FilterParam = {
  active: boolean;
  dataSource: FilterParamDataSource;
  key: string;
  value: FilterValue;
};

export enum FilterParamDataSource {
  FarmOnboarding,
  Values,
}

export type FilterValue = FilterValueOption | FilterValueRange;

export type FilterValueOption = {
  options: string[];
};

export type FilterValueRange = {
  max: number;
  min: number;
};

export const isOptionFilterParam = (
  param: FilterParam
): param is FilterParam & { value: FilterValueOption } => {
  return "options" in param.value;
};

export const isRangeFilterParam = (
  param: FilterParam
): param is FilterParam & { value: FilterValueRange } => {
  return "min" in param.value;
};

const filters = atom<Filter[]>({
  key: "filters",
  default: [
    {
      color: sample(schemeTableau10)!,
      id: Math.random().toString(),
      name: "Filter 1",
      params: [
        {
          active: true,
          dataSource: FilterParamDataSource.FarmOnboarding,
          key: "types",
          value: { options: ["directsale_farm"] },
        },
      ],
    },
  ],
});

export const useFilters = () => useRecoilValue(filters);

export const useUpdateFilterName = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string, name: string) =>
      set((filters) =>
        filters.map((f) => (f.id === filterId ? { ...f, name } : f))
      ),
    []
  );
};

let filterId = 0;
let filterNamePostfix = 1;
const COLORS = schemeTableau10.slice(0, 9);
export const useAddFilter = () => {
  const set = useSetRecoilState(filters);
  return useCallback((filter: Partial<Filter> = {}) => {
    const id = (filterId++).toString();
    set((filters) => {
      const name = `New Filter ${filterNamePostfix++}`;
      const freeColors = without(COLORS, ...filters.map((g) => g.color));
      const color = sample(freeColors.length > 0 ? freeColors : COLORS)!;
      const newFilter: Filter = {
        id,
        name,
        color,
        params: [],
        ...filter,
      };
      return [...filters, newFilter];
    });
    return id;
  }, []);
};

export const useRemoveFilter = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string) =>
      set((filters) => filters.filter((f) => f.id !== filterId)),
    []
  );
};

export const useEditFilterParam = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string, key: string, value: FilterValue) =>
      set((filters) =>
        filters.map((f) =>
          f.id === filterId
            ? {
                ...f,
                params: f.params.map((p) =>
                  p.key === key ? { ...p, value } : p
                ),
              }
            : f
        )
      ),
    []
  );
};

export const useSetFilterParamActive = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string, key: string, active: boolean) =>
      set((filters) =>
        filters.map((f) =>
          f.id === filterId
            ? {
                ...f,
                params: f.params.map((p) =>
                  p.key === key ? { ...p, active } : p
                ),
              }
            : f
        )
      ),
    []
  );
};

export const useAddFilterParam = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string, param: FilterParam) =>
      set((filters) =>
        filters.map((f) =>
          f.id === filterId
            ? {
                ...f,
                params: [...f.params.filter((p) => p.key !== param.key), param],
              }
            : f
        )
      ),
    []
  );
};

export const useRemoveFilterParam = () => {
  const set = useSetRecoilState(filters);
  return useCallback(
    (filterId: string, key: string) =>
      set((filters) =>
        filters.map((f) =>
          f.id === filterId
            ? {
                ...f,
                params: f.params.filter((p) => p.key !== key),
              }
            : f
        )
      ),
    []
  );
};
