import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Legend } from "./Legend";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Legend",
  component: Legend,
} as ComponentMeta<typeof Legend>;

const Template: ComponentStory<typeof Legend> = (args) => <Legend {...args} />;

export const Default = Template.bind({});
Default.args = {
  entries: [
    { color: "red", name: "tillage" },
    { color: "blue", name: "irigation" },
    { color: "green", name: "harvest" },
    { color: "orange", name: "amendments" },
    { color: "violet", name: "seeding" },
    { color: "yellow", name: "weed contor" },
  ],
};
