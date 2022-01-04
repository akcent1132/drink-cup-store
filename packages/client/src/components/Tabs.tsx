import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import "../index.css";
import { Button } from "./Button";
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
  & :last-child {
    margin-right: 40px;
  }
`;

const Body = styled.div`
  flex: 1;
  background-color: ${BG_COLOR};
  border-top: 1px solid white;
`;

const Tab = styled(Button)<{ active: boolean }>`
  height-100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  
  background-color: ${(props) => (props.active ? BG_COLOR : "rgba(0,0,0,.5)")};
  ${props => props.active ? `box-shadow: 0px 1px 0px 0px ${BG_COLOR}; z-index: 1;` : ''}
`;

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
            onClick={() => onChange(tabIndex)}
            label={page.label}
            active={tabIndex === index}
          />
        ))}
      </Head>
      <Body>
        {pages[index] ? pages[index].renderPanel() : null}
      </Body>
    </Root>
  );
};
