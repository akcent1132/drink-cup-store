import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";
import { Button, Card, CardBody, CardFooter, CardHeader, Drop } from "grommet";

export const defaultTheme = {
  borderColor: "rgba(255,255,255,.4)",
  backgroundColor: "#181818",
  textColor: "#ffffff",
  textSize: 16,
  arrowSize: 8,
  height: 20,
};

const Container = styled.div<{ x: number; y: number }>`
  width: 3px;
  height: 3px;
  background-color: red;
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const Root = withTheme(styled.div`
  font-family: ${(p) => p.theme.font};

  position: relative;
  display: flex;
  bottom: ${(p) =>
    p.theme.valuePopup.height / 2 +
    (p.theme.valuePopup.arrowSize * Math.SQRT2) / 2}px;
  transform: translate3d(0, -50%, 0);
  // box-shadow: 2px 2px 8px ${(p) => p.theme.valuePopup.borderColor};
  border: solid 1.2px ${(p) => p.theme.valuePopup.borderColor};
  background: ${(p) => p.theme.valuePopup.backgroundColor};
  color: ${(p) => p.theme.valuePopup.textColor};
  font-size: : ${(p) => p.theme.valuePopup.textSize}px;
  width: fit-content;
  height: ${(p) => p.theme.valuePopup.height}px;
  white-space: nowrap;
  :after {
    content: "";
    width: ${(p) => p.theme.valuePopup.arrowSize}px;
    height: ${(p) => p.theme.valuePopup.arrowSize}px;
    transform: rotate(-45deg);
    background: ${(p) => p.theme.valuePopup.backgroundColor};
    position: absolute;
    // box-shadow: 1px 4px 8px ${(p) => p.theme.valuePopup.borderColor};
    border: solid 1px ${(p) => p.theme.valuePopup.borderColor};
    z-index: -1;
    bottom: -${(p) => p.theme.valuePopup.arrowSize / 2}px;
    left: calc(50% - ${(p) => p.theme.valuePopup.arrowSize / 2}px);
  }
`);

const Content = withTheme(styled.div`
  margin: auto 12px;
  background: ${(p) => p.theme.valuePopup.backgroundColor};
  height: ${(p) => p.theme.valuePopup.height}px;
  line-height: ${(p) => p.theme.valuePopup.height}px;
`);

interface Props {
  value: string;
  x: number;
  y: number;
}

export const EventDetailsPopup = ({ value, x, y }: Props) => {
  const [target, setTarget] = useState(null);
  const ref = useCallback(node => setTarget(node), []);
  return (
    <>
      <Container ref={ref} {...{ x, y }}></Container>
      {target ? (
        <Drop target={target} responsive style={{pointerEvents: 'none'}}>
          <Card height="small" width="small" background="light-1">
            <CardHeader pad="medium">Header</CardHeader>
            <CardBody pad="medium">{value}</CardBody>
            <CardFooter pad={{ horizontal: "small" }} background="light-2">
              {/* <Button
          icon={<Icons.Favorite color="red" />}
          hoverIndicator
          />
          <Button icon={<Icons.ShareOption color="plain" />} hoverIndicator /> */}
            </CardFooter>
          </Card>
        </Drop>
      ) : null}
    </>
  );
};
