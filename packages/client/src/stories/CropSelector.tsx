/** @jsxImportSource @emotion/react */

import React, { useMemo } from "react";
import { css } from "@emotion/react";
import { useCropSelectorQuery } from "./CropSelector.generated";
import { groupBy, map, sortBy, startCase } from "lodash";
import {
  useSelectedCropType,
  useSetSelectedCropType,
} from "../states/selectedCropType";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)<BadgeProps>({
  "& .MuiBadge-badge": {
    right: -20,
    top: 13,
    padding: "0 4px",
  },
});

export const CropSelector = () => {
  const { data: { availableCropTypes } = {} } = useCropSelectorQuery();
  const value = useSelectedCropType();
  const setSelectedCropType = useSetSelectedCropType();
  const crops = useMemo(
    () =>
      sortBy(
        (availableCropTypes || []).filter((d) => d.plantingCount >= 30),
        "cropType"
      ),
    [availableCropTypes]
  );
  console.log({ crops });
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel id="demo-simple-select-helper-label">Crop Type</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        label="Crop Type"
        onChange={(e) => setSelectedCropType(e.target.value)}
        renderValue={(value) => startCase(value)}
      >
        {crops.map(({ cropType, plantingCount }) => (
          <MenuItem key={cropType} value={cropType} sx={{ paddingRight: 6 }}>
            <StyledBadge
              badgeContent={plantingCount}
              color="primary"
              showZero
              max={1000}
            >
              {startCase(cropType)}
            </StyledBadge>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    // <Select
    //   css={css`
    //     height: 0px;
    //   `}
    //   placeholder="Select a crop"
    //   value={value}
    //   valueKey={{ key: "value", reduce: true }}
    //   labelKey="label"
    //   options={options}
    //   onChange={({ value }) => setSelectedCropType(value)}
    // />
  );
};
