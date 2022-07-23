import { sortBy, startCase, without } from "lodash";
import { useCallback, useMemo, useState } from "react";
import {
  addFilterParam,
  removeFilterParam,
} from "../../contexts/FiltersContext";
import { Filterable } from "./getFilterables";
import { FilterParam, FilterParamDataSource } from "../../graphql.generated";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/Input";
import { Filter } from "../../contexts/FiltersCtx";
import BarChartIcon from "@mui/icons-material/BarChart";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type Param = Filter["params"][number];
type Props = {
  filterables: Filterable[];
  filterId: string;
  params: Param[];
};

const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());

const OptionListItem = ({
  option,
  selected,
}: {
  option: Filterable;
  selected: boolean;
}) => (
  <MenuItem key={option.key} value={option.key} selected={selected}>
    <ListItemText>{prettyKey(option.key)}</ListItemText>
    <ListItemIcon>
      {option.type === "numeric" ? (
        <BarChartIcon fontSize="small" />
      ) : (
        <JoinInnerIcon fontSize="small" />
      )}
    </ListItemIcon>
  </MenuItem>
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const FilterParamSelector = ({
  filterId,
  params,
  filterables,
}: Props) => {
  const [options, setOptions] = useState(filterables);
  const sortedOptions = useMemo(
    () => sortBy(options, ["dataSource", "key"]),
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
            __typename: "FilterParam",
            key: filterable.key,
            active: true,
            dataSource: filterable.dataSource,
            value:
              filterable.type === "numeric"
                ? {
                    __typename: "FilterValueRange",
                    min: Math.min(...filterable.values),
                    max: Math.max(...filterable.values),
                  }
                : {
                    __typename: "FilterValueOption",
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
      disableCloseOnSelect
      options={sortedOptions}
      value={currentOptions}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Filter Properties"
          placeholder="Select Filter Properties..."
        />
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
