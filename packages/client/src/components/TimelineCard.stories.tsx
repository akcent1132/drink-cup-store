import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TimelineCard } from "./TimelineCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/TimelineCard",
  component: TimelineCard,
} as ComponentMeta<typeof TimelineCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TimelineCard> = (args) => {
  const [index, onChange] = useState(0);
  console.log("template", index);
  return <TimelineCard {...{ ...args, index, onChange }} />;
};

export const Default = Template.bind({});
Default.args = {
  color: "teal",
  params: {
    zone: "8b",
    temperature: "65",
    precipitation: "47 in",
    texture: "Sand: 38% | Slit 41% | Clay 21%",
  },
};
