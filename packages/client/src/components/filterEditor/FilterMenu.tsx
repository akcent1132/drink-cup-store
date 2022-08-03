import Autocomplete from "@mui/material/Autocomplete";
import Badge, { BadgeProps } from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { uniq } from "lodash";
import React, { useCallback, useMemo } from "react";
import {
  FilterParam,
  FilterValueOption,
  useEditFilterParam,
  useRemoveFilter,
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
import { useShowPlantingCards } from "../../states/sidePanelContent";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const FilterMenu: React.FC<{
  filterId: string;
}> = ({ filterId }) => {
  const removeFilter = useRemoveFilter();
  const showPlantingCards = useShowPlantingCards();
  const remove = useCallback(
    () => {
        removeFilter(filterId);
        showPlantingCards()
    },
    [removeFilter, filterId]
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

      <ListItemIcon>
        <DeleteIcon /></ListItemIcon>
        <ListItemText>Delete Filter</ListItemText>
      </MenuItem>
        <MenuItem onClick={() => {showPlantingCards(); handleClose()}}>
          <ListItemIcon>
          <CloseIcon /></ListItemIcon>
          <ListItemText>Close Filter Editor</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
