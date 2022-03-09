import React from 'react';

import { FormClose } from 'grommet-icons';
import { Box, Button, Keyboard, Text, TextInput } from 'grommet';

const allSuggestions = ['sony', 'sonar', 'foo', 'bar'];

const Tag = ({ children, onRemove, ...rest }: any) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
      margin={{ vertical: 'xxsmall' }}
      round="medium"
      {...rest}
    >
      <Text size="xsmall" margin={{ right: 'xxsmall' }}>
        {children}
      </Text>
      {onRemove && <FormClose size="small" color="white" />}
    </Box>
  );

  if (onRemove) {
    return <Button onClick={onRemove}>{tag}</Button>;
  }
  return tag;
};

const TagInput = ({ value = [], onAdd, onChange, onRemove, ...rest }: any) => {
  const [currentTag, setCurrentTag] = React.useState('');
  const boxRef = React.useRef();

  const updateCurrentTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const onAddTag = (tag: string) => {
    if (onAdd) {
      onAdd(tag);
    }
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag('');
    }
  };

  const renderValue = () =>

        /*@ts-ignore*/
    value.map((v, index) => (
      <Tag
        margin="xxsmall"
        key={`${v}${index + 0}`}
        onRemove={() => onRemove(v)}
      >
        {v}
      </Tag>
    ));

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: 'xsmall' }}
        border="all"
        /*@ts-ignore*/
        ref={boxRef}
        wrap
      >
        {value.length > 0 && renderValue()}
        <Box flex style={{ minWidth: '120px' }}>
          <TextInput
            type="search"
            plain
            dropTarget={boxRef.current}
            {...rest}
            onChange={updateCurrentTag}
            value={currentTag}
            onSuggestionSelect={(event) => onAddTag(event.suggestion)}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};

type Props = {
  onChange: (value: string[]) => void;
  value: string[],
  options: string[],
}

export const TagOptions = ({value, onChange, options}: Props) => {
  const [suggestions, setSuggestions] = React.useState(options);

  const onRemoveTag = (tag: string) => {
    const removeIndex = value.indexOf(tag);
    const newTags = [...value];
    if (removeIndex >= 0) {
      newTags.splice(removeIndex, 1);
    }
    onChange(newTags);
  };

  const onAddTag = (tag: string) => onChange([...value, tag]);

  const onFilterSuggestion = (value: string) =>
    setSuggestions(
      allSuggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().indexOf(value.toLowerCase()) >= 0,
      ),
    );

  return (
    <Box pad="small">
      <TagInput
        placeholder="Search for aliases..."
        suggestions={suggestions}
        value={value}
        onRemove={onRemoveTag}
        onAdd={onAddTag}

        /*@ts-ignore*/
        onChange={({ target: { value } }) => onFilterSuggestion(value)}
      />
    </Box>
  );
};