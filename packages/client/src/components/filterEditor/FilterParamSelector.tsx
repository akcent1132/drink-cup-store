import { sortBy, startCase, without } from "lodash";
import { useMemo, useState } from "react";
import {
  addFilterParam,
  removeFilterParam,
} from "../../contexts/FiltersContext";
import { Filterable } from "./getFilterables";
import { FilterParam, FilterParamDataSource } from "../../graphql.generated";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/Input";
import { Filter } from "../../contexts/FiltersCtx";
import BarChartIcon from "@mui/icons-material/BarChart";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type Param = Filter["params"][number];
type Props = {
  filterables: Filterable[];
  filterId: string;
  params: Param[];
};

const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());

// function getStyles(name: string, personName: string[], theme: Theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

const OptionListItem = ({option}: {option: Filterable}) => (
  <MenuItem key={option.key} value={option.key}>
          <ListItemText>{prettyKey(option.key)}</ListItemText>
          <ListItemIcon>
            {option.type === "numeric" ? (
              <BarChartIcon  fontSize="small" />
            ) : (
              <JoinInnerIcon fontSize="small" />
            )}
          </ListItemIcon>
        </MenuItem>
)

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
  const farmOptions = useMemo(
    () =>
      sortBy(options.filter(
        (o) => o.dataSource === FilterParamDataSource.FarmOnboarding
      ), 'key'),
    [options]
  );
  const statOptions = useMemo(
    () =>
      sortBy(options.filter(
        (o) => o.dataSource === FilterParamDataSource.Values
      ), 'key'),
    [options]
  );

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const selectedKeys = typeof value === "string" ? value.split(",") : value;
    const currentKeys = params.map((p) => p.key);
    // add new filter params
    without(selectedKeys as string[], ...currentKeys)
      .map((key) => filterables.find((f) => f.key === key))
      .filter((f): f is Filterable => !!f)
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
    without(currentKeys, ...selectedKeys).map((key) =>
      removeFilterParam(filterId, key)
    );
  };

  return (
    <Select
      label="Filter Properties"
      multiple
      placeholder="Select Filter Properties..."
      value={params.filter((p) => p.active).map((p) => p.key)}
      onChange={handleChange}
      input={<OutlinedInput />}
      MenuProps={MenuProps}
      displayEmpty
      renderValue={(selected) => {
        console.log("selected", selected);
        if (selected.length === 0) {
          return <em>Select a filter property...</em>;
        }

        return selected.join(", ");
      }}
    >
      <MenuItem disabled value="">
        <em>Farm properties:</em>
      </MenuItem>

      {farmOptions.map((option) => (
        <OptionListItem key={option.key} option={option} />
      ))}
      <Divider light />

      <MenuItem disabled value="">
        <em>Statistical properties:</em>
      </MenuItem>
      {statOptions.map((option) => (
        <OptionListItem key={option.key} option={option} />
      ))}
    </Select>
  );
};
