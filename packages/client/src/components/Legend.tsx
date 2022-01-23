import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";
import tinycolor from "tinycolor2";
// TODO read height from props

const Root = withTheme(styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 8px 28px;
  background-color: ${(props) => props.theme.colors.darkTransparent};
`);

const ColorDot = withTheme(styled.div<{ color: string }>`
    background-color: ${(props) => props.theme.color(props.color)};
    height: 16px;
    width: 16px;
    border-radius: 50%;
`);

const Tag = withTheme(styled.div`
  flex: 0;
  display: flex;
  gap: 10px;
  min-width: 33%;
  font-size: 12px;
  font-family: ${(props) => props.theme.fonts.baseBold};
  text-transform: uppercase;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px 4px;
  color: white;
`);

type Entry = {
    color: string,
    name: string,
}
interface Props {
  entries: Entry[]
}

/**
 * Legend component
 */
export const Legend = ({
  entries
}: Props) => {
  return (
    <Root>
      {entries.map(entry => <Tag><ColorDot color={entry.color} />{entry.name}</Tag>)}
    </Root>
  );
};
