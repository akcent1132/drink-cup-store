import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Badge, { BadgeProps } from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import { uniq } from "lodash";
import React, { useMemo } from "react";
import {
  FilterParam,
  FilterValueOption,
  useEditFilterParam,
} from "../../states/filters";

import { FilterableOption } from "./getFilterables";
import { prettyKey } from "./prettyKey";
import styled from "@mui/material/styles/styled";

// import { FormClose } from "grommet-icons";
// import { Box, Button, Select, Text } from "grommet";
// import { without } from "lodash";

// type Option = {
//   value: string;
//   label?: string;
// };
// type Props = {
//   onChange: (value: string[]) => void;
//   value: string[];
//   options: Option[];
//   allowSearch?: boolean;
// };

// export const TagSelect = ({
//   value,
//   onChange,
//   options: defaultOptions,
//   allowSearch,
// }: Props) => {
//   const [options, setOptions] = useState(defaultOptions);
//   const onRemoveSeason = (option: Option) => {
//     onChange(value.filter((o) => o !== option.value));
//   };

//   const renderTag = (option: Option) => (
//     <Button
//       key={`season_tag_${option.value}`}
//       href="#"
//       onClick={(event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         onRemoveSeason(option);
//       }}
//       onFocus={(event) => event.stopPropagation()}
//     >
//       <Box
//         align="center"
//         direction="row"
//         gap="xsmall"
//         pad={{ vertical: "xsmall", horizontal: "small" }}
//         margin="xsmall"
//         background="accent-1"
//         round="large"
//       >
//         <Text size="small" weight="bold">
//           {option.label || option.value}
//         </Text>
//         <Box round="full" margin={{ left: "xsmall" }}>
//           <FormClose size="small" style={{ width: "12px", height: "12px" }} />
//         </Box>
//       </Box>
//     </Button>
//   );

//   const renderOption = (option: Option, state: any) => (
//     <Box pad="small" background={state.active ? "active" : undefined}>
//       {option.label || option.value}
//     </Box>
//   );

//   return (
//     // Uncomment <Grommet> lines when using outside of storybook
//     // <Grommet theme={...}>
//     <Box fill align="stretch" justify="center">
//       <Select
//         closeOnChange={false}
//         multiple
//         value={
//           <Box wrap direction="row">
//             {value && value.length ? (
//               value
//                 .map((v) => options.find((o) => o.value === v))
//                 .filter(Boolean)
//                 .map((option) => renderTag(option!))
//             ) : (
//               <Box
//                 pad={{ vertical: "xsmall", horizontal: "small" }}
//                 margin="xsmall"
//               >
//                 Select
//               </Box>
//             )}
//           </Box>
//         }
//         options={options}
//         valueKey={{ key: "value", reduce: true }}
//         onChange={({ option }) => {
//           if (value.includes(option.value)) {
//             onChange(without(value, option.value));
//           } else {
//             onChange([...value, option.value]);
//           }
//         }}
//         onClose={() => setOptions(defaultOptions)}
//         onSearch={
//           allowSearch
//             ? (text) => {
//                 // The line below escapes regular expression special characters:
//                 // [ \ ^ $ . | ? * + ( )
//                 const escapedText = text.replace(
//                   /[-\\^$*+?.()|[\]{}]/g,
//                   "\\$&"
//                 );

//                 // Create the regular expression with modified value which
//                 // handles escaping special characters. Without escaping special
//                 // characters, errors will appear in the console
//                 const exp = new RegExp(escapedText, "i");
//                 setOptions(defaultOptions.filter((o) => exp.test(o.value)));
//               }
//             : undefined
//         }
//       >
//         {renderOption}
//       </Select>
//     </Box>
//     // </Grommet>
//   );
// };

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -20,
    top: 13,
    padding: "0 4px",
  },
}));

export const TagSelect = ({
  filterable,
  param,
  filterId,
}: {
  filterable?: FilterableOption;
  param: FilterParam & { value: FilterValueOption };
  filterId: string;
}) => {
  const editFilterParam = useEditFilterParam();
  const options = useMemo(
    () =>
      uniq([
        ...(filterable?.options.map((o) => o.value) || []),
        ...param.value.options,
      ]).sort(),
    [filterable?.options]
  );
  const occurences = useMemo(
    () =>
      Object.fromEntries(
        (filterable?.options || []).map((o) => [o.value, o.occurences])
      ),
    [filterable?.options]
  );

  return (
    <Autocomplete
      multiple
      onChange={(_, options) =>
        editFilterParam(filterId, param.key, {
          ...param.value,
          options,
        })
      }
      options={options}
      value={param.value.options}
      getOptionLabel={(option) => prettyKey(option)}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <StyledBadge badgeContent={occurences[option] || 0} color="secondary" showZero>
            {prettyKey(option)}
          </StyledBadge>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={prettyKey(param.key)}
        />
      )}
    />
  );
};
