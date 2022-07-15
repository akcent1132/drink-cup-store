import { Select, Text } from "grommet";
import { useMemo, useState } from "react";
import { setActiveFilterParams } from "../../contexts/FiltersContext";
import { FilterEditorQuery } from "./FilterEditor.generated";

type Props = {
  filterId: string;
  params: NonNullable<FilterEditorQuery["filter"]>["params"];
};

export const FilterParamSelector = ({ filterId, params }: Props) => {
  const [options, setOptions] = useState(params);
  const label = "Select filter properties..."
  return (
    <Select
      multiple
      clear
      size="medium"
      plain
      messages={{multiple: label}}
      placeholder={label}
      options={options}
      valueLabel={<Text>{label}</Text>}
      value={params.filter((p) => p.active).map((p) => p.key)}
      valueKey={{ key: "key", reduce: true }}
      labelKey="key"
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
    />
  );
};
