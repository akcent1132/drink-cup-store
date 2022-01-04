import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ValueDistribution } from './ValueDistribution';
import { genDataPoints } from '../utils/random'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/ValueDistribution',
  component: ValueDistribution,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ValueDistribution>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ValueDistribution> = (args) => <ValueDistribution {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Value Distribution',
  values: genDataPoints('fooo oo'),
};

