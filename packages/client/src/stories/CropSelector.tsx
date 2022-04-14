/** @jsxImportSource @emotion/react */

import React, { useMemo, useState } from "react";
import { CROPS } from "../contexts/lists";
import { Box, Select, Text } from "grommet";
import { css } from "@emotion/react";
import { selectedCropType } from "../contexts/FiltersContext";
import { useCropSelectorQuery } from "./CropSelector.generated";
import { capitalize, find, startCase } from "lodash";
import Badge from "@mui/material/Badge";

export const CropSelector = () => {
  const { data } = useCropSelectorQuery();
  const options = useMemo(() => CROPS.map(({name, plantingCount}) => ({
    value: name, 
    label: `${startCase(name)}: ${plantingCount}`
    // TODO find out why how to have nice labels in the selected field as well
    // label: (
    //   <Box direction="row" gap="5px" align="center">
    //     {startCase(name)}
    //     <Box background="accent-1" pad="xxsmall" round="xxsmall">
    //       <Text size="10px" weight="bold">{plantingCount}</Text>
    //     </Box>
    //   </Box>
    // )
  })), [])
  console.log("data?.selectedCropType", data?.selectedCropType)
  return (
    <Select
      css={css`
        height: 30px;
      `}
      dropHeight="small"
      placeholder="Select a crop"
      value={data?.selectedCropType}
      valueKey={{ key: 'value', reduce: true }}
      labelKey="label"
      options={options}
      onChange={({ value }) => {console.log("selectedCropType(value)", value);selectedCropType(value)}}
    />
  );
};
