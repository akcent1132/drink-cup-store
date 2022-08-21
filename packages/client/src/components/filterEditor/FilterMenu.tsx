import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useCallback } from "react";
import {
  useRemoveFilter
} from "../../states/filters";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useShowPlantingCards } from "../../states/sidePanelContent";

export const FilterMenu: React.FC<{
  filterId: string;
}> = ({ filterId }) => {
  const removeFilter = useRemoveFilter();
  const showPlantingCards = useShowPlantingCards();
  const remove = useCallback(() => {
    removeFilter(filterId);
    showPlantingCards();
  }, [removeFilter, filterId]);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={0}
    >
      <Tooltip title="Delete Filter">
        <IconButton onClick={remove}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Close Filter Editor">
        <IconButton onClick={showPlantingCards}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
