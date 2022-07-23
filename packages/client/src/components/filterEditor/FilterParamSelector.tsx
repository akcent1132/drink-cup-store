import { startCase, without } from "lodash";
import { useState } from "react";
import {
  addFilterParam,
  removeFilterParam,
} from "../../contexts/FiltersContext";
import { Filterable } from "./getFilterables";
import { FilterParam } from "../../graphql.generated";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { OutlinedInput, Theme } from "@mui/material";
import { Filter } from "../../contexts/FiltersCtx";

type Param = Filter["params"][number];
type Props = {
  filterables: Filterable[];
  filterId: string;
  params: Param[];
};

const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());

// function getStyles(name: string, personName: string[], theme: Theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const FilterParamSelector = ({
  filterId,
  params,
  filterables,
}: Props) => {
  const [options, setOptions] = useState(filterables);
  const label = "Select filter properties...";

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const selectedKeys = typeof value === "string" ? value.split(",") : value;
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
  };

  return (
    <Select
      labelId="demo-multiple-name-label"
      id="demo-multiple-name"
      multiple
      value={params.filter((p) => p.active).map((p) => p.key)}
      onChange={handleChange}
      input={<OutlinedInput label="Name" />}
      MenuProps={MenuProps}
    >
      {options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          {prettyKey(option.key)}
        </MenuItem>
      ))}
    </Select>
  );

  // const renderOption = (option: Filterable) => {
  //   const active = params.some((p) => p.key === option.key);
  //   return (
  //     <Box
  //       direction="row"
  //       align="center"
  //       pad="xsmall"
  //       flex={false}
  //       background={active ? "" : ""}
  //     >
  //       {option.type === "numeric" ? (
  //         <Time size="medium" />
  //       ) : (
  //         <BlockQuote size="medium" />
  //       )}
  //       <Text
  //         size="medium"
  //         weight={active ? "bold" : "normal"}
  //         style={{ marginLeft: "4px" }}
  //       >
  //         {prettyKey(option.key)}
  //       </Text>
  //     </Box>
  //   );
  // };

  // return (
  //   <Select

  //   css={css`
  //   height: 0px;
  // `}
  //     multiple
  //     // clear={{ label: "Remove all" }}
  //     size="small"
  //     // dropHeight="medium"
  //     // plain
  //     // messages={{ multiple: label }}
  //     // placeholder={label}
  //     options={options}
  //     // valueLabel={<Text>{label}</Text>}
  //     value={params.filter((p) => p.active).map((p) => p.key)}
  //     valueKey={{ key: "key", reduce: true }}
  //     // labelKey={(option) => renderOption(option)}

  //     labelKey={(option) => option.key}
  //     onChange={({ value: selectedKeys }) => {
  //       const currentKeys = params.map((p) => p.key);
  //       // add new filter params
  //       without(selectedKeys as string[], ...currentKeys)
  //         .map((key) => filterables.find((f) => f.key === key))
  //         .filter((f): f is Filterable => !!f)
  //         .map(
  //           (filterable): FilterParam => ({
  //             __typename: "FilterParam",
  //             key: filterable.key,
  //             active: true,
  //             dataSource: filterable.dataSource,
  //             value:
  //               filterable.type === "numeric"
  //                 ? {
  //                     __typename: "FilterValueRange",
  //                     min: Math.min(...filterable.values),
  //                     max: Math.max(...filterable.values),
  //                   }
  //                 : {
  //                     __typename: "FilterValueOption",
  //                     options: [],
  //                   },
  //           })
  //         )
  //         .map((p) => addFilterParam(filterId, p));

  //       // remove removed params
  //       without(currentKeys, ...selectedKeys).map((key) =>
  //         removeFilterParam(filterId, key)
  //       );
  //     }}
  //     closeOnChange={false}
  //     onClose={() => setOptions(filterables)}
  //     // onSearch={(text) => {
  //     //   // The line below escapes regular expression special characters:
  //     //   // [ \ ^ $ . | ? * + ( )
  //     //   const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");

  //     //   // Create the regular expression with modified value which
  //     //   // handles escaping special characters. Without escaping special
  //     //   // characters, errors will appear in the console
  //     //   const exp = new RegExp(escapedText, "i");
  //     //   setOptions(filterables.filter((p) => exp.test(p.key)));
  //     // }}
  //   />
  // );
};
