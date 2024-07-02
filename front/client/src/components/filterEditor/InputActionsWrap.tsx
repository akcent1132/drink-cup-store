import DeleteIcon from "@mui/icons-material/Delete";
import React, { useCallback } from "react";
import { useRemoveFilterParam } from "../../states/filters";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

export const InputActionsWrap: React.FC<{
  filterId: string;
  paramKey: string;
}> = ({ filterId, paramKey, children }) => {
  const removeFilterParam = useRemoveFilterParam();
  const remove = useCallback(
    () => removeFilterParam(filterId, paramKey),
    [removeFilterParam, filterId, paramKey]
  );
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={0}
    >
      <Box flexGrow={1}>{children}</Box>
      <Tooltip title="Remove Filter Parameter">
        <IconButton onClick={remove}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
