import { useCallback, useMemo } from "react";
import { format } from "d3-format";
import Slider from "@mui/material/Slider";
import {
  FilterParam,
  FilterValueRange,
  useEditFilterParam,
} from "../../states/filters";
import { FilterableNumeric } from "./getFilterables";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { sortBy } from "lodash";
import Box from "@mui/material/Box";
import { prettyKey } from "../../utils/format";

const TickedSlider = styled(Slider)({
  "& .MuiSlider-mark": {
    height: 4,
    width: 2,
    opacity: 0.4,
  },
});

const Label = styled(Typography)({
  color: "rgba(255, 255, 255, 0.7)",
});

export const RangeSlider = ({
  filterable,
  param,
  filterId,
}: {
  filterable?: FilterableNumeric;
  param: FilterParam & { value: FilterValueRange };
  filterId: string;
}) => {
  const editFilterParam = useEditFilterParam();

  const handleChange = useCallback(
    (_: any, value: number | number[]) =>
      Array.isArray(value) &&
      editFilterParam(filterId, param.key, {
        min: value[0],
        max: value[1],
      }),
    [filterId, param]
  );

  const allValues = useMemo(
    () => sortBy(filterable?.values || []),
    [filterable?.values]
  );
  const intMode = useMemo(
    () => allValues.length > 0 && allValues.every(Number.isInteger),
    [allValues]
  );
  const min = useMemo(
    () => Math.min(param.value.min, ...allValues),
    [allValues]
  );
  const max = useMemo(
    () => Math.max(param.value.max, ...allValues),
    [allValues]
  );
  const formatter = useMemo(
    () => (intMode ? format("") : format(".1f")),
    [intMode]
  );
  const step = intMode ? 1 : 0.01;
  const marks = useMemo(
    () =>
      allValues.map((value, i) =>
        i === 0 || i === allValues.length - 1
          ? { value, label: formatter(value) }
          : { value }
      ),
    [allValues]
  );

  return (
    <Box mx={1}>
      <Label variant="caption">{prettyKey(param.key)}</Label>
      <TickedSlider
        disabled={!filterable}
        getAriaLabel={() => prettyKey(param.key)}
        getAriaValueText={formatter}
        value={[param.value.min, param.value.max]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={step}
        min={min}
        max={max}
        marks={marks}
      />
    </Box>
  );
};
