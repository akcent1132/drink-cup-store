import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { EventsBar, defaultKnobs } from "./IconEventsBar";
import { getFarmEvents } from "../utils/random";
import { withEditableTheme } from "../theme/withEditableTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/IconEventsBar",
  component: EventsBar,
  args: {
    knobs: defaultKnobs,
  },
} as ComponentMeta<typeof EventsBar>;

const EventsBarWithTheme = withEditableTheme(EventsBar)
const Template: ComponentStory<typeof EventsBarWithTheme> = (args) => (
  <EventsBarWithTheme {...args} />
);

export const Default = Template.bind({});

Default.args = {
  events: getFarmEvents(),
};
