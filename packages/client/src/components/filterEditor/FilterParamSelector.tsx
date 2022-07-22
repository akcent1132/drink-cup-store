import { Box, Select, Text } from "grommet";
import { BlockQuote, Time } from "grommet-icons";
import { startCase, without } from "lodash";
import { useState } from "react";
import {
  addFilterParam,
  removeFilterParam,
} from "../../contexts/FiltersContext";
import { Filterable } from "./getFilterables";
import { FilterEditorQuery } from "./FilterEditor.generated";
import { FilterParam } from "../../graphql.generated";
import { css } from "@emotion/react";

type Param = NonNullable<FilterEditorQuery["filter"]>["params"][number];
type Props = {
  filterables: Filterable[];
  filterId: string;
  params: Param[];
};

const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());

export const FilterParamSelector = ({
  filterId,
  params,
  filterables,
}: Props) => {
  const [options, setOptions] = useState(filterables);
  const label = "Select filter properties...";

  const renderOption = (option: Filterable) => {
    const active = params.some((p) => p.key === option.key);
    return (
      <Box
        direction="row"
        align="center"
        pad="xsmall"
        flex={false}
        background={active ? "" : ""}
      >
        {option.type === "numeric" ? (
          <Time size="medium" />
        ) : (
          <BlockQuote size="medium" />
        )}
        <Text
          size="medium"
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

    css={css`
    height: 0px;
  `}
      multiple
      // clear={{ label: "Remove all" }}
      size="small"
      // dropHeight="medium"
      // plain
      // messages={{ multiple: label }}
      // placeholder={label}
      options={options}
      // valueLabel={<Text>{label}</Text>}
      value={params.filter((p) => p.active).map((p) => p.key)}
      valueKey={{ key: "key", reduce: true }}
      // labelKey={(option) => renderOption(option)}

      labelKey={(option) => option.key}
      onChange={({ value: selectedKeys }) => {
        const currentKeys = params.map((p) => p.key);
        // add new filter params
        without(selectedKeys as string[], ...currentKeys)
          .map((key) => filterables.find((f) => f.key === key))
          .filter((f): f is Filterable => !!f)
          .map(
            (filterable): FilterParam => ({
              __typename: "FilterParam",
              key: filterable.key,
              active: true,
              dataSource: filterable.dataSource,
              value:
                filterable.type === "numeric"
                  ? {
                      __typename: "FilterValueRange",
                      min: Math.min(...filterable.values),
                      max: Math.max(...filterable.values),
                    }
                  : {
                      __typename: "FilterValueOption",
                      options: [],
                    },
            })
          )
          .map((p) => addFilterParam(filterId, p));

        // remove removed params
        without(currentKeys, ...selectedKeys).map((key) =>
          removeFilterParam(filterId, key)
        );
      }}
      closeOnChange={false}
      // onClose={() => setOptions(filterables)}
      // onSearch={(text) => {
      //   // The line below escapes regular expression special characters:
      //   // [ \ ^ $ . | ? * + ( )
      //   const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

      //   // Create the regular expression with modified value which
      //   // handles escaping special characters. Without escaping special
      //   // characters, errors will appear in the console
      //   const exp = new RegExp(escapedText, "i");
      //   setOptions(filterables.filter((p) => exp.test(p.key)));
      // }}
    />
  );
};
