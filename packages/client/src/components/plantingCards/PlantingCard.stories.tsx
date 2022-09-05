import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PlantingCard } from "./PlantingCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/PlantingCard",
  component: PlantingCard,
} as ComponentMeta<typeof PlantingCard>;

const Template: ComponentStory<typeof PlantingCard> = (args) => (
  <PlantingCard {...args} />
);

// export const Default = Template.bind({});
// Default.args = {
//   params: {
//     zone: "8b",
//     temperature: "65",
//     precipitation: "47 in",
//     texture: "Sand: 38% | Slit 41% | Clay 21%",
//   },
//   events: getFarmEvents(),
// };
