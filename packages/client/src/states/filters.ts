import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export type Filter = {
  color: string;
  cropType: string;
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
  __typename: "FilterValueOption";
  options: string[];
};

export type FilterValueRange = {
  __typename: "FilterValueRange";
  max: number;
  min: number;
};

const filters = atom<Filter[]>({
  key: "filters",
  default: [],
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
export const useAddFilter = () => {
  const set = useSetRecoilState(filters);
  return useCallback((color: string, name: string, cropType: string) => {
    const id = (++filterId).toString();
    const filter: Filter = {
      id,
      name,
      cropType,
      color,
      params: [],
    };
    set((filters) => [...filters, filter]);
    return filter;
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
