/** @jsxImportSource @emotion/react */

import { ComponentProps } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { Button } from "./Button";
import { css } from "@emotion/react";
import tinycolor from "tinycolor2";
// TODO read height from props

const BG_COLOR = "#4B5F25";

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  height: 39px;
  flex: 0;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
`;

const Body = styled.div`
  flex: 1;
  background-color: ${BG_COLOR};
  border-top: 1px solid white;
`;

const Tab = (
  props: { active: boolean } & ComponentProps<typeof Button>
) => {
  const { active, ...buttonProps } = props;
  const color = active ? BG_COLOR : "rgba(23,23,23,.5)";
  
  return (
    <Button
      {...{ ...buttonProps, color }}
      css={css`
        height-100%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        ${active ? `box-shadow: 0px 1px 0px 0px ${BG_COLOR}; z-index: 1;` : ""}
        :hover {
          background: linear-gradient(to bottom, ${tinycolor(color).lighten(4).toString()}, ${color} );
        }
        :active {
          background: linear-gradient(to bottom, ${tinycolor(color).darken(1).toString()}, ${color} );
        }
      `}
    />
  );
};

interface Page {
  label: string;
  renderPanel: () => JSX.Element;
}

interface Props {
  index: number;
  onChange: (index: number) => void;
  pages: Page[];
}

/**
 * Primary UI component for user interaction
 */
export const Tabs = ({ pages, index, onChange }: Props) => {
  return (
    <Root>
      <Head>
        {pages.map((page, tabIndex) => (
          <Tab
            key={tabIndex}
            onClick={() => onChange(tabIndex)}
            label={page.label}
            active={tabIndex === index}
            isWide
          />
        ))}
      </Head>
      <Body>{pages[index] ? pages[index].renderPanel() : null}</Body>
    </Root>
  );
};
