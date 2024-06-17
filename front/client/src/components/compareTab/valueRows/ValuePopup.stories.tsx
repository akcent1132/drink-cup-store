import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { useCallback, useState } from "react";

import { withEditableTheme } from "../../../theme/withEditableTheme";
import { ValuePopup } from "./ValuePopup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/ValuePopup",
  component: ValuePopup,
} as ComponentMeta<typeof ValuePopup>;

const ValuePopupWithTheme = withEditableTheme(ValuePopup);

const Template: ComponentStory<typeof ValuePopupWithTheme> = (args) => {
  const [[x, y], setXY] = useState([55, 55]);
  const onClick = useCallback((e: React.MouseEvent) => {
    setXY([e.nativeEvent.clientX, e.nativeEvent.clientY]);
  }, []);
  return (
    <div
      style={{ width: 500, height: 500, background: "tomato" }}
      onClick={onClick}
    >
      <ValuePopupWithTheme {...args} {...{ x, y }} />
    </div>
  );
};

export const Default = Template.bind({
  value: 123.4,
  x: 0,
  y: 0,
});
