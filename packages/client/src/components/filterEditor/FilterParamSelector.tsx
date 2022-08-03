import { sortBy, without } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Filterable } from "./getFilterables";
import MenuItem from "@mui/material/MenuItem";
import BarChartIcon from "@mui/icons-material/BarChart";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import {
  FilterParam,
  FilterParamDataSource,
  useAddFilterParam,
  useRemoveFilterParam,
} from "../../states/filters";
import { prettyKey } from "./prettyKey";

type Props = {
  filterables: Filterable[];
  filterId: string;
  params: FilterParam[];
};

export const FilterParamSelector = ({
  filterId,
  params,
  filterables: options,
}: Props) => {
  const [open, setOpen] = useState(params.length === 0)
  const addFilterParam = useAddFilterParam();
  const removeFilterParam = useRemoveFilterParam();
  const sortedOptions = useMemo(
    () => sortBy(options, ["dataSource", (o) => prettyKey(o.key)]),
    [options]
  );
  const currentOptions = useMemo(
    () =>
      params
        .filter((param) => param.active)
        .map((param) => options.find((option) => option.key === param.key))
        .filter((p): p is Filterable => !!p),
    [options, params]
  );

  const handleChange = useCallback(
    (_: any, newSelection: Filterable[]) => {
      // add new filter params
      without(newSelection, ...currentOptions)
        .map(
          (filterable): FilterParam => ({
            key: filterable.key,
            active: true,
            dataSource: filterable.dataSource,
            value:
              filterable.type === "numeric"
                ? {
                    min: Math.min(...filterable.values),
                    max: Math.max(...filterable.values),
                  }
                : {
                    options: [],
                  },
          })
        )
        .map((p) => addFilterParam(filterId, p));

      // remove removed params
      without(currentOptions, ...newSelection).map((filterable) =>
        removeFilterParam(filterId, filterable.key)
      );
    },
    [currentOptions]
  );

  return (
    <Autocomplete
      multiple
      limitTags={3}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={sortedOptions}
      value={currentOptions}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label="Select Filters" placeholder="Search..."/>
      )}
      noOptionsText="Can't find  filter properties"
      groupBy={(option) =>
        option.dataSource === FilterParamDataSource.FarmOnboarding
          ? "Farm Onboarding Data"
          : "Statistical Data"
      }
      getOptionLabel={(option) => option.key}
      renderOption={(liProps, option) => (
        <MenuItem key={option.key} {...liProps}>
          <ListItemText>{prettyKey(option.key)}</ListItemText>
          <ListItemIcon>
            {option.type === "numeric" ? (
              <BarChartIcon fontSize="small" />
            ) : (
              <JoinInnerIcon fontSize="small" />
            )}
          </ListItemIcon>
        </MenuItem>
      )}
    />
  );
};
