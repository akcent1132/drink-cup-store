import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tabs } from "./Tabs";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Tabs",
  component: Tabs,
  parameters: {
    backgrounds: { default: "dark" },
  },
} as ComponentMeta<typeof Tabs>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tabs> = (args) => {
  const [index, onChange] = useState(0);
  return <Tabs {...{ ...args, index, onChange }} />;
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  pages: [
    { label: "Compare", renderPanel: () => <div>Compare</div> },
    { label: "My Data", renderPanel: () => <div>My Data</div> },
  ],
};
