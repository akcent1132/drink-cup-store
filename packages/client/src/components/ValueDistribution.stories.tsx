import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ValueDistribution, defaultKnobs } from './ValueDistribution';
import { genDataPoints } from '../utils/random'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/ValueDistribution',
  component: ValueDistribution,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  args: {
    knobs: defaultKnobs,
  },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ValueDistribution>;

const Template: ComponentStory<typeof ValueDistribution> = (args) => <ValueDistribution {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Value Distribution',
  values: [{
    color: 'orange',
    values: genDataPoints('foo3'),
    showVariance: true,
  }, {
    color: 'yellow',
    values: genDataPoints('foo2'),
    showVariance: true,
  }],
};

