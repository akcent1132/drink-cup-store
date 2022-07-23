import { useReactiveVar } from "@apollo/client";
import React, { useContext } from "react";
import { filters as filtersVar } from "./FiltersContext";

export type Filter = ReturnType<typeof filtersVar>[number]
type FiltersCtx = {
  filters: Filter[];
};
const FiltersCtx = React.createContext<FiltersCtx>({ filters: [] });
export const useFilters = () => useContext(FiltersCtx);

export const FiltersProvider: React.FC = (props) => {
  const filters = useReactiveVar(filtersVar);

  return (
    <FiltersCtx.Provider value={{ filters }}>
      {props.children}
    </FiltersCtx.Provider>
  );
};
