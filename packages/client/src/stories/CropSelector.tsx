/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { CROPS } from "../contexts/lists";
import { Select } from "grommet";
import { css } from "@emotion/react";
import { selectedCropType } from "../contexts/FiltersContext";
import { useCropSelectorQuery } from "./CropSelector.generated";


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
      options={CROPS}
      onChange={({ value }) => selectedCropType(value)}
    />
  );
};
