/** @jsxImportSource @emotion/react */

import React, { useMemo, useState } from "react";
import { Box, Select, Text } from "grommet";
import { css } from "@emotion/react";
import { selectedCropType } from "../contexts/FiltersContext";
import { useCropSelectorQuery } from "./CropSelector.generated";
import { capitalize, find, groupBy, map, sortBy, startCase } from "lodash";

export const CropSelector = () => {
  const { data: { allPlantings, selectedCropType: value } = {} } = useCropSelectorQuery();
  console.log("CROP SELECTOR", value)
  const crops = useMemo(
    () =>
      sortBy(
        map(groupBy(allPlantings, "cropType"), (plantings, cropType) => ({
          name: cropType,
          plantingCount: plantings.length,
        })).filter(d => d.plantingCount >= 30),
        "name"
      ),
    [allPlantings]
  );
  const options = useMemo(
    () =>
      crops.map(({ name, plantingCount }) => ({
        value: name,
        label: `${startCase(name)}: ${plantingCount}`,
        // TODO find out why how to have nice labels in the selected field as well
        // label: (
        //   <Box direction="row" gap="5px" align="center">
        //     {startCase(name)}
        //     <Box background="accent-1" pad="xxsmall" round="xxsmall">
        //       <Text size="10px" weight="bold">{plantingCount}</Text>
        //     </Box>
        //   </Box>
        // )
      })),
    [crops]
  );

  return (
    <Select
      css={css`
        height: 0px;
      `}
      placeholder="Select a crop"
      value={value}
      valueKey={{ key: "value", reduce: true }}
      labelKey="label"
      options={options}
      onChange={({ value }) => selectedCropType(value)}
    />
  );
};
