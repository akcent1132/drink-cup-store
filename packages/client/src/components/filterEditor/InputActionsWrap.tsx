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

export const InputActionsWrap: React.FC<{
  filterId: string;
  paramKey: string;
}> = ({ filterId, paramKey, children }) => {
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
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={0}
    >

      <Box flexGrow={1}>{children}</Box>
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
    </Stack>
  );
};
