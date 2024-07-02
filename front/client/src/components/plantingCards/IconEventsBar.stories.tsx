import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { IconEventsBar } from "./IconEventsBar";
import { getFarmEvents } from "../../utils/random";
import { withEditableTheme } from "../../theme/withEditableTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/IconEventsBar",
  component: IconEventsBar,
} as ComponentMeta<typeof IconEventsBar>;

const EventsBarWithTheme = withEditableTheme(IconEventsBar);
const Template: ComponentStory<typeof EventsBarWithTheme> = (args) => (
  <EventsBarWithTheme {...args} />
);

export const Default = Template.bind({});

Default.args = {
  events: getFarmEvents().map((e) => ({
    ...e,
    details: [],
    date: e.date.toString(),
    __typename: "PlantingEvent",
  })),
};
