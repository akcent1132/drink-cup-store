/** @jsxImportSource @emotion/react */

import { ComponentProps } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { Button } from "./Button";
import { css, useTheme, withTheme } from "@emotion/react";
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
  justify-content: flex-start;
`;

const Body = withTheme(styled.div`
  flex: 1;
  background-color: ${p => p.theme.colors.bgTab};
  border: 1px solid ${(p) => p.theme.colors.divider};
`);

const Tab = (
  props: { active: boolean } & ComponentProps<typeof Button>
) => {
  const { colors } = useTheme();
  const { active, ...buttonProps } = props;
  const color = active ? colors.bgTab : colors.bgSidePanel;
  
  return (
    <Button
      {...{ ...buttonProps, color }}
      css={css`
        height-100%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border: ${active ? 1 : 0}px solid ${colors.divider};
        border-bottom: none;
        ${active ? `box-shadow: 0px 1px 0px 0px ${colors.bgTab}; z-index: 1;` : ""}
        :hover {
          background: linear-gradient(to bottom, ${tinycolor(color).lighten(7).toString()}, ${color} );
        }
        :active {
          background: linear-gradient(to bottom, ${tinycolor(color).lighten(10).toString()}, ${color} );
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
  className?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Tabs = ({ pages, index, onChange, className }: Props) => {
  return (
    <Root className={className}>
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
