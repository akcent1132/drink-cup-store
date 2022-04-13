/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { CROPS } from "../contexts/lists";
import { Box, Select, Text } from "grommet";
import { css } from "@emotion/react";
import { selectedCropType } from "../contexts/FiltersContext";
import { useCropSelectorQuery } from "./CropSelector.generated";
import { capitalize } from "lodash";
import Badge from "@mui/material/Badge";

export const CropSelector = () => {
  const { data } = useCropSelectorQuery();
  return (
    <Select
      // size="small"
      css={css`
        height: 30px;
      `}
      dropHeight="small"
      placeholder="Select a crop"
      value={data?.selectedCropType}
      valueKey={{key: 'name', reduce: true}}
      labelKey={(c) => (
        <Box direction="row" gap="5px" align="center">
          {capitalize(c.name)}{" "}
          <Box background="accent-1" pad="xxsmall" round="xxsmall">
            <Text size="10px" weight="bold">{c.plantingCount}</Text>
          </Box>
        </Box>
      )}
      options={CROPS}
      onChange={({ value }) => {console.log("selectedCropType(value)", value);selectedCropType(value)}}
    />
  );
};
