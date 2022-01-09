import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {  
  label: "+ Add"
};

export const Wide = Template.bind({});
Wide.args = {  
  label: "Button Text",
  color: 'teal',
  isWide: true
};

