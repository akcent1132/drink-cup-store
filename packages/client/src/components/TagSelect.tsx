import React, { useState } from 'react';

import { FormClose } from 'grommet-icons';
import { Box, Button, Select, Text } from 'grommet';

const allSeasons = [
  'S01',
  'S02',
  'S03',
  'S04',
  'S05',
  'S06',
  'S07',
  'S08',
  'S09',
  'S10',
];


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

  const renderSeason = (season: string) => (
    <Button
      key={`season_tag_${season}`}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemoveSeason(season);
      }}
      onFocus={(event) => event.stopPropagation()}
    >
      <Box
        align="center"
        direction="row"
        gap="xsmall"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin="xsmall"
        background="brand"
        round="large"
      >
        <Text size="small">{season}</Text>
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
    <Box fill align="center" justify="center">
      <Select
        closeOnChange={false}
        multiple
        value={
          <Box wrap direction="row" width="small">
            {value && value.length ? (
              value.map(option => renderSeason(option))
            ) : (
              <Box
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                margin="xsmall"
              >
                Select Season
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
