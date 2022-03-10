import React, { useState } from 'react';

import { FormClose } from 'grommet-icons';
import { Box, Button, Select, Text } from 'grommet';
import { css } from '@emotion/react';

type Props = {
    onChange: (value: string[]) => void;
    value: string[],
    options: string[],
  }

export const TagSelect = ({value, onChange, options}: Props) => {

  const onRemoveSeason = (option: string) => {
    onChange(
      value.filter((o) => o !== option),
    );
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
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin="xsmall"
        background="accent-1"
        round="large"
      >
        <Text size="small" weight="bold">{option}</Text>
        <Box round="full" margin={{ left: 'xsmall' }}>
          <FormClose size="small" style={{ width: '12px', height: '12px' }} />
        </Box>
      </Box>
    </Button>
  );

  const renderOption = (option: string, state: any) => (
    <Box pad="small" background={state.active ? 'active' : undefined}>
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
              value.map(option => renderTag(option))
            ) : (
              <Box
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                margin="xsmall"
              >
                Select
              </Box>
            )}
          </Box>
        }
        options={options}
        selected={value.map(v => options.indexOf(v))}
        onChange={({ value: nextSelected }) => {
          onChange([...nextSelected].sort());
        }}
      >
        {renderOption}
      </Select>
    </Box>
    // </Grommet>
  );
};
