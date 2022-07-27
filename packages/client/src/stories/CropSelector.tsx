/** @jsxImportSource @emotion/react */

import React, { useMemo } from "react";
import { Select } from "grommet";
import { css } from "@emotion/react";
import { useCropSelectorQuery } from "./CropSelector.generated";
import { groupBy, map, sortBy, startCase } from "lodash";
import {
  useSelectedCropType,
  useSetSelectedCropType,
} from "../states/selectedCropType";

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

  const options = useMemo(
    () =>
      (crops || []).map(({ cropType, plantingCount }) => ({
        value: cropType,
        label: `${startCase(cropType)}: ${plantingCount}`,
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
      onChange={({ value }) => setSelectedCropType(value)}
    />
  );
};
