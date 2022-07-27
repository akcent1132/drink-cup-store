import Autocomplete from "@mui/material/Autocomplete";
import Badge, { BadgeProps } from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { uniq } from "lodash";
import React, { useCallback, useMemo } from "react";
import {
  FilterParam,
  FilterValueOption,
  useEditFilterParam,
  useRemoveFilterParam,
} from "../../states/filters";

import { FilterableOption } from "./getFilterables";
import { prettyKey } from "./prettyKey";
import styled from "@mui/material/styles/styled";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const InputMenu = ({ filterId, paramKey }: { filterId: string; paramKey: string }) => {
  const removeFilterParam = useRemoveFilterParam();
  const remove = useCallback(
    () => removeFilterParam(filterId, paramKey),
    [removeFilterParam, filterId, paramKey]
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={remove}>
          <DeleteIcon />
          Remove
        </MenuItem>
      </Menu>
    </>
  );
};

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
  
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={0}
    >
      <Box flexGrow={1}>
        <Autocomplete
          multiple
          onChange={(_, options) =>
            editFilterParam(filterId, param.key, {
              ...param.value,
              options,
            })
          }
          options={options}
          value={param.value.options}
          getOptionLabel={(option) => prettyKey(option)}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <StyledBadge
                badgeContent={occurences[option] || 0}
                color="secondary"
                showZero
              >
                {prettyKey(option)}
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
      </Box>
      <InputMenu filterId={filterId} paramKey={param.key} />
    </Stack>
  );
};
