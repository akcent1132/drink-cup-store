import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => {
  const [index, onChange] = useState(0);
  console.log('template', index)
 return  <Button {...{...args, index, onChange}}/>
};

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

