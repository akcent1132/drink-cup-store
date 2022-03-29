/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import { CROPS } from "../contexts/FiltersContext";
import { Select } from "grommet";
import { css } from "@emotion/react";

export const CropSelector = () => {
  const [crop, setCrop] = useState(CROPS[0]);
  return (
    <Select
      // size="small"
      css={css`height: 30px;`}
      dropHeight="small"
      placeholder="Select a crop"
      value={crop}
      options={CROPS}
      onChange={({ value }) => setCrop(value)}
    />
  );
};
