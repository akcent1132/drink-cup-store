import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { EventDetailsPopup } from "./EventDetailsPopup";
import { theme } from "../theme/theme";
import { withEditableTheme } from "../theme/withEditableTheme";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/EventDetailsPopup",
  component: EventDetailsPopup,
} as ComponentMeta<typeof EventDetailsPopup>;

const EventDetailsPopupWithTheme = withEditableTheme(EventDetailsPopup);

const Template: ComponentStory<typeof EventDetailsPopupWithTheme> = (args) => (
  <EventDetailsPopupWithTheme {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Herbicide",
  date: "Dec 21, 2022",
};
