import React, { useState } from "react";

import { FormClose } from "grommet-icons";
import { Box, Button, Select, Text } from "grommet";
import { without } from "lodash";

type Option = {
  value: string;
  label?: string;
};
type Props = {
  onChange: (value: string[]) => void;
  value: string[];
  options: Option[];
  allowSearch?: boolean;
};

export const TagSelect = ({
  value,
  onChange,
  options: defaultOptions,
  allowSearch,
}: Props) => {
  const [options, setOptions] = useState(defaultOptions);
  const onRemoveSeason = (option: Option) => {
    onChange(value.filter((o) => o !== option.value));
  };

  const renderTag = (option: Option) => (
    <Button
      key={`season_tag_${option.value}`}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemoveSeason(option);
      }}
      onFocus={(event) => event.stopPropagation()}
    >
      <Box
        align="center"
        direction="row"
        gap="xsmall"
        pad={{ vertical: "xsmall", horizontal: "small" }}
        margin="xsmall"
        background="accent-1"
        round="large"
      >
        <Text size="small" weight="bold">
          {option.label || option.value}
        </Text>
        <Box round="full" margin={{ left: "xsmall" }}>
          <FormClose size="small" style={{ width: "12px", height: "12px" }} />
        </Box>
      </Box>
    </Button>
  );

  const renderOption = (option: Option, state: any) => (
    <Box pad="small" background={state.active ? "active" : undefined}>
      {option.label || option.value}
    </Box>
  );

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={...}>
    <Box fill align="stretch" justify="center">
      <Select
        closeOnChange={false}
        multiple
        value={
          <Box wrap direction="row">
            {value && value.length ? (
              value
                .map((v) => options.find((o) => o.value === v))
                .filter(Boolean)
                .map((option) => renderTag(option!))
            ) : (
              <Box
                pad={{ vertical: "xsmall", horizontal: "small" }}
                margin="xsmall"
              >
                Select
              </Box>
            )}
          </Box>
        }
        options={options}
        valueKey={{ key: "value", reduce: true }}
        onChange={({ option }) => {
          if (value.includes(option.value)) {
            onChange(without(value, option.value));
          } else {
            onChange([...value, option.value]);
          }
        }}
        onClose={() => setOptions(defaultOptions)}
        onSearch={
          allowSearch
            ? (text) => {
                // The line below escapes regular expression special characters:
                // [ \ ^ $ . | ? * + ( )
                const escapedText = text.replace(
                  /[-\\^$*+?.()|[\]{}]/g,
                  "\\$&"
                );

                // Create the regular expression with modified value which
                // handles escaping special characters. Without escaping special
                // characters, errors will appear in the console
                const exp = new RegExp(escapedText, "i");
                setOptions(defaultOptions.filter((o) => exp.test(o.value)));
              }
            : undefined
        }
      >
        {renderOption}
      </Select>
    </Box>
    // </Grommet>
  );
};
