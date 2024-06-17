import { Box, CheckBox, Select, Text } from "grommet";
import { BlockQuote, Time } from "grommet-icons";
import { startCase } from "lodash";
import { useMemo, useState } from "react";
import { setActiveFilterParams } from "../../contexts/FiltersContext";
import { FilterEditorQuery } from "./FilterEditor.generated";

type Param = NonNullable<FilterEditorQuery["filter"]>["params"][number];
type Props = {
  filterId: string;
  params: Param[];
};

const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());

export const FilterParamSelector = ({ filterId, params }: Props) => {
  const [options, setOptions] = useState(params);
  const label = "Select filter properties...";

  const renderOption = (option: Param) => {
    const active = params.find((p) => p.key === option.key)?.active;
    return (
      <Box
        direction="row"
        align="center"
        pad="xsmall"
        flex={false}
        background={active ? "accent-1" : ""}
      >
        {option.value.__typename === "FilterValueRange" ? (
          <Time size="small" />
        ) : (
          <BlockQuote size="small" />
        )}
        <Text
          size="small"
          weight={active ? "bold" : "normal"}
          style={{ marginLeft: "4px" }}
        >
          {prettyKey(option.key)}
        </Text>
      </Box>
    );
  };

  return (
    <Select
      multiple
      clear={{ label: "Remove all" }}
      size="small"
      dropHeight="medium"
      plain
      messages={{ multiple: label }}
      placeholder={label}
      options={options}
      valueLabel={<Text>{label}</Text>}
      value={params.filter((p) => p.active).map((p) => p.key)}
      valueKey={{ key: "key", reduce: true }}
      labelKey={({ key }) => prettyKey(key)}
      onChange={({ value: nextValue }) =>
        setActiveFilterParams(filterId, nextValue)
      }
      closeOnChange={false}
      onClose={() => setOptions(params)}
      onSearch={(text) => {
        // The line below escapes regular expression special characters:
        // [ \ ^ $ . | ? * + ( )
        const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

        // Create the regular expression with modified value which
        // handles escaping special characters. Without escaping special
        // characters, errors will appear in the console
        const exp = new RegExp(escapedText, "i");
        setOptions(params.filter((p) => exp.test(p.key)));
      }}
    >
      {renderOption}
    </Select>
  );
};
