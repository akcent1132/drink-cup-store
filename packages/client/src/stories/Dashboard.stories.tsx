import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Dashboard } from "./Dashboard";
import { Global, css } from "@emotion/react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Dashboard",
  component: Dashboard,
  decorators: [
    (Story) => (
      <div>
        <Global
          styles={css`
            body {
              padding: 0 !important;
            }
          `}
        />
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Dashboard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Dashboard> = (args) => (
  <Dashboard {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  label: "Dashboard",
};