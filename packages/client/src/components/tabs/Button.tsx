import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../../index.css";
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
  line-height: 32px;
  font-size: 15px;
  padding: 0 50px;
  border-width: 0;
  background-color: ${(props) => props.theme.color(props.color)};
  color: white;
`);

interface Props {
  color: string;
  label: string;
}

/**
 * Button component
 */
export const Button = ({ label, color = "green" }: Props) => {
  return <Root {...{ color }}>{label}</Root>;
};
