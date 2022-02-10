import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";
import { theme } from "../theme/theme";
import { withEditableTheme } from "../theme/withTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
} as ComponentMeta<typeof Button>;



const ButtonWithTheme = withEditableTheme(Button);

const Template: ComponentStory<typeof ButtonWithTheme> = (args) => (
  <ButtonWithTheme {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "+ Add",
};

export const Wide = Template.bind({});
Wide.args = {
  label: "Button Text",
  color: "teal",
  isWide: true,
};
