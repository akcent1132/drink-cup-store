import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import "../../index.css";
// TODO read height from props

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
`;

const Body = styled.div`
  flex: 1;
`;

const Tab = styled.div`
  min-width: 300px;
  height-100%;
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
  console.log({index, onChange})
  return (
    <Root>
      <Head>
        {pages.map((page, tabIndex) => (
          <Tab onClick={() => onChange(tabIndex)}>{page.label}</Tab>
        ))}
      </Head>
      <Body>
        Panel {index}
        {pages[index] ? pages[index].renderPanel() : null}
      </Body>
    </Root>
  );
};
