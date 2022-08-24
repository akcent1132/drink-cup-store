/** @jsxImportSource @emotion/react */

import React, { useMemo } from "react";
import { css } from "@emotion/react";
import {
  useCropSelectorQuery,
  useCropSelectorSlowQuery,
} from "./CropSelector.generated";
import { groupBy, isString, map, sortBy, startCase } from "lodash";
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
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import { Box } from "grommet/components/Box";

const StyledBadge = styled(Badge)<BadgeProps>({
  "& .MuiBadge-badge": {
    top: 13,
    padding: "0 4px",
    marginLeft: 4,
    position: 'relative',
    transform: 'scale(1) translate(0, -50%)'
  },
});

export const CropSelector = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { availableCropTypes, connectedFarmIds } =
    useCropSelectorQuery().data || {};
  const { producers: ownedFarms } =
    useCropSelectorSlowQuery({
      variables: {
        producerIds: (connectedFarmIds || []).filter(isString),
      },
    }).data || {};
  const value = useSelectedCropType();
  const setSelectedCropType = useSetSelectedCropType();
  const crops = useMemo(() => {
    const result = (availableCropTypes || [])
      .map((availableCropType) => ({
        ...availableCropType,
        ownedPlantingCount: ownedFarms && ownedFarms.length > 0
          ? ownedFarms
              .map((f) => f?.plantings)
              .flat()
              .filter((p) => p?.cropType === availableCropType.cropType).length
          : null,
      }))
      // only show cropTypes if there are more that 30 or the user owns a planting
      .filter((c) => c.plantingCount >= 30 || c.ownedPlantingCount);
    return sortBy(result, "cropType");
  }, [availableCropTypes, ownedFarms]);
  return (
    <div ref={ref}>
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
          {crops.map(({ cropType, plantingCount, ownedPlantingCount }) => (
            <MenuItem key={cropType} value={cropType} sx={{ paddingRight: 7 }}>
              <Tooltip
                title={
                  <>
                    {ownedPlantingCount ? (
                      <>{ownedPlantingCount} yours from the </>
                    ) : (
                      null
                    )}
                    {`${plantingCount} planting${plantingCount > 1 ? "s" : ''}`}
                  </>
                }
                placement="top-end"
              >
                <StyledBadge
                  badgeContent={
                    <>
                      {ownedPlantingCount === null ? (
                        ""
                      ) : (
                        <>
                          <span
                            style={{
                              fontWeight: ownedPlantingCount ? 900 : "inherit",
                            }}
                          >
                            {ownedPlantingCount}
                          </span>
                          /
                        </>
                      )}
                      {plantingCount}
                    </>
                  }
                  color="primary"
                  showZero
                >
                  {startCase(cropType)}
                </StyledBadge>
              </Tooltip>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
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
});
