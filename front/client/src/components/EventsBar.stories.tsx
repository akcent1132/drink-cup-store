import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { EventsBar, defaultKnobs } from "./EventsBar";
import { getFarmEvents } from "../utils/random";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EventsBar",
  component: EventsBar,
  args: {
    knobs: defaultKnobs,
  },
} as ComponentMeta<typeof EventsBar>;

const Template: ComponentStory<typeof EventsBar> = (args) => (
  <EventsBar {...args} />
);

export const Default = Template.bind({});

Default.args = {
  events: getFarmEvents(),
};
