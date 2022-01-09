import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { EventsCard } from "./EventsCard";
import { getFarmEvents } from "../utils/random";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EventsCard",
  component: EventsCard,
} as ComponentMeta<typeof EventsCard>;


const Template: ComponentStory<typeof EventsCard> = (args) => <EventsCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: "teal",
  params: {
    zone: "8b",
    temperature: "65",
    precipitation: "47 in",
    texture: "Sand: 38% | Slit 41% | Clay 21%",
  },
  events: getFarmEvents(),
};
