import React, { useState } from "react";

import { FormClose } from "grommet-icons";
import { Box, Button, Select, Text } from "grommet";
import { css } from "@emotion/react";
import { without } from "lodash";

type Props = {
  onChange: (value: string[]) => void;
  value: string[];
  options: string[];
  allowSearch?: boolean;
};

export const TagSelect = ({
  value,
  onChange,
  options: defaultOptions,
  allowSearch,
}: Props) => {
  const [options, setOptions] = useState(defaultOptions);
  const onRemoveSeason = (option: string) => {
    onChange(value.filter((o) => o !== option));
  };

  const renderTag = (option: string) => (
    <Button
      key={`season_tag_${option}`}
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
          {option}
        </Text>
        <Box round="full" margin={{ left: "xsmall" }}>
          <FormClose size="small" style={{ width: "12px", height: "12px" }} />
        </Box>
      </Box>
    </Button>
  );

  const renderOption = (option: string, state: any) => (
    <Box pad="small" background={state.active ? "active" : undefined}>
      {option}
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
              value.map((option) => renderTag(option))
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
        selected={value.map((v) => options.indexOf(v))}
        onChange={({ option }) => {
          if (value.includes(option)) {
            onChange(without(value, option))
          }
          else {
            onChange([...value, option])
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
                setOptions(defaultOptions.filter((o) => exp.test(o)));
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
