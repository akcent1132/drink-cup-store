import Autocomplete from "@mui/material/Autocomplete";
import Badge, { BadgeProps } from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import { uniq } from "lodash";
import { useCallback, useMemo } from "react";
import {
  FilterParam,
  FilterValueOption,
  useEditFilterParam,
} from "../../states/filters";

import styled from "@mui/material/styles/styled";
import { FilterableOption } from "./getFilterables";
import { formatValue, prettyKey } from "../../utils/format";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -20,
    top: 13,
    padding: "0 4px",
  },
}));

export const TagSelect = ({
  filterable,
  param,
  filterId,
}: {
  filterable?: FilterableOption;
  param: FilterParam & { value: FilterValueOption };
  filterId: string;
}) => {
  const editFilterParam = useEditFilterParam();
  const options = useMemo(
    () =>
      uniq([
        ...(filterable?.options.map((o) => o.value) || []),
        ...param.value.options,
      ]).sort(),
    [filterable?.options]
  );
  const occurences = useMemo(
    () =>
      Object.fromEntries(
        (filterable?.options || []).map((o) => [o.value, o.occurences])
      ),
    [filterable?.options]
  );

  const handleChange = useCallback(
    (_, options: string[]) =>
      editFilterParam(filterId, param.key, {
        ...param.value,
        options,
      }),
    [filterId, param]
  );

  return (
    <Autocomplete
      disabled={!filterable}
      multiple
      onChange={handleChange}
      options={options}
      value={param.value.options}
      getOptionLabel={(option) => formatValue(option)}
      disableCloseOnSelect
      disableClearable
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <StyledBadge
            badgeContent={occurences[option] || 0}
            color="secondary"
            showZero
          >
            {formatValue(option)}
          </StyledBadge>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={prettyKey(param.key)}
        />
      )}
    />
  );
};
