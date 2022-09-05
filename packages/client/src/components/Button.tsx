import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import tinycolor from "tinycolor2";
// TODO read height from props

const Root = withTheme(styled.button<{ color: string }>`
  /* reset style */
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: 100%;
  margin: 0;
  overflow: hidden;
  text-transform: none;
  -webkit-appearance: button;

  height: 100%;
  border-radius: 15px;
  height: 30px;
  line-height: 31px;
  font-size: 15px;
  border-width: 0;
  background-color: ${(props) => props.theme.color(props.color)};
  :hover {
    background-color: ${(props) =>
      tinycolor(props.theme.color(props.color)).brighten(4).toString()};
  }
  :active {
    background-color: ${(props) =>
      tinycolor(props.theme.color(props.color)).darken(1).toString()};
  }
  color: ${(p) => p.theme.colors.textPrimary};

  display: flex;
  flex-wrap: nowrap;
`);

const Padding = styled.div<{ isWide: boolean }>`
  flex-shrink: 100;
  width: ${(props) => (props.isWide ? 50 : 15)}px;
`;

const Caption = styled.div`
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
`;

interface Props {
  color?: string;
  label: string;
  className?: string;
  isWide?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Button component
 */
export const Button = ({
  label,
  color = "green",
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  isWide = false,
}: Props) => {
  return (
    <Root {...{ color, onClick, onMouseEnter, onMouseLeave, className }}>
      <Padding isWide={isWide} />
      <Caption>{label}</Caption>
      <Padding isWide={isWide} />
    </Root>
  );
};
