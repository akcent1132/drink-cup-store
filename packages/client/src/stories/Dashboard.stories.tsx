import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Dashboard } from "./Dashboard";
import { Global, css } from "@emotion/react";
import { defaultKnobs as valueDistributionKnobs } from "../components/ValueDistribution";
import { defaultKnobs as eventsBarKnobs } from "../components/EventsBar";
import { withEditableTheme } from "../theme/withEditableTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Dashboard",
  component: Dashboard,
  args: {
    knobs: {
      valueDistribution: valueDistributionKnobs,
      eventsBar: eventsBarKnobs,
    },
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
} as ComponentMeta<typeof Dashboard>;

const DashboardWithTheme = withEditableTheme(Dashboard);
const Template: ComponentStory<typeof DashboardWithTheme> = (args) => (
  <DashboardWithTheme {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  iframeSrc: "https://www.hylo.com/all",
};
