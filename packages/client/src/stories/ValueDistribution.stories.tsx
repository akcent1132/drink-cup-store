import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ValueDistribution } from './ValueDistribution';

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

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'ValueDistribution',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'ValueDistribution',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'ValueDistribution',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'ValueDistribution',
};
