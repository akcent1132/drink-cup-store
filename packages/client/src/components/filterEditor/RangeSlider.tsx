import { Box, RangeSelector, Select, Stack, Text } from "grommet";
import styled from "@emotion/styled";
import { startCase } from "lodash";
import { useMemo, useState } from "react";
import { setActiveFilterParams } from "../../contexts/FiltersContext";
import { FilterEditorQuery } from "./FilterEditor.generated";

const TickBox = styled.div`
  width: 100%;
  height: 16px;
  position: relative;
`;
const Tick = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  background-color: white;
  top: 0;
  opacity: 0.4;
`;

export const RangeSlider = ({
  min,
  max,
  value,
  allValues,
  onChange,
}: {
  min: number;
  max: number;
  value: number[];
  allValues: number[];
  onChange: (bounds: number[]) => void;
}) => (
  <Box gap="small">
    <Stack>
      <TickBox>
        {allValues.map((v) => (
          <Tick
            style={{
              left: `${((v - min) / (max - min)) * 100}%`,
            }}
          />
        ))}
      </TickBox>
      <RangeSelector
        direction="horizontal"
        min={min}
        max={max}
        // step={1}
        values={value}
        onChange={(values) => onChange(values)}
      />
    </Stack>
    <Box align="center">
      <Text size="small">{`${value[0]} - ${value[1]}/${allValues.length}`}</Text>
    </Box>
  </Box>
);
