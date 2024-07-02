import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { App } from "./Dashboard";
import { Global, css } from "@emotion/react";
import { withEditableTheme } from "../theme/withEditableTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Dashboard",
  component: App,
  parameters: {
    backgrounds: { disable: true },
  },
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
} as ComponentMeta<typeof App>;

const DashboardWithTheme = withEditableTheme(App);
const Template: ComponentStory<typeof DashboardWithTheme> = (args) => (
  <DashboardWithTheme {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  // TODO use ?layoutFlags=mobileSettings
  iframeSrc: "https://www.hylo.com/all",
};
