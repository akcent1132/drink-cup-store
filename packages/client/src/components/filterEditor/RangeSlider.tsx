import { Box, RangeSelector, Select, Stack, Text } from "grommet";
import styled from "@emotion/styled";
import { useMemo } from "react";
import { format } from "d3-format";

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
}) => {
  const intMode = useMemo(() => allValues.every(Number.isInteger), [allValues]);
  const formatter = useMemo(
    () => (intMode ? format("") : format(".1f")),
    [intMode]
  );
  const step = intMode ? 1 : 0.01;
  return (
    <Box gap="small">
      <Stack>
        <TickBox>
          {allValues.map((v, i) => (
            <Tick
              key={i}
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
          step={step}
          values={value}
          onChange={(values) => {
            console.log(values);
            onChange(values);
          }}
        />
      </Stack>
      <Box align="center">
        <Text size="small">{`${formatter(value[0])} - ${formatter(
          value[1]
        )}`}</Text>
      </Box>
    </Box>
  );
};
