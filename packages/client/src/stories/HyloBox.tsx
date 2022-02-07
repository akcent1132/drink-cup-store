/** @jsxImportSource @emotion/react */

import React, { useState } from "react";
import styled from "@emotion/styled";

const HyloDragger = styled.div<{
  height: number;
  left: number;
  width: number;
  headerHeight: number;
  open: boolean;
  hovering: boolean;
}>`
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  left: ${(p) => p.left}px;
  position: fixed;
  right: 40px;
  top: ${(p) =>
    p.open
      ? `calc(100vh - ${p.height}px)`
      : `calc(100vh - ${p.headerHeight + (p.hovering ? 10 : 0)}px)`};
  background-color: #00c6b4;
  transition: all 0.3s cubic-bezier(0.14, -0.03, 0.49, 1.02);
`;

const HyloIFrame = styled.iframe`
  width: 100%;
  height: 100%;
`;

const HeaderClick = styled.div<{ open: boolean; headerHeight: number }>`
  height: ${(p) => (p.open ? `${p.headerHeight}px` : "100%")};
  width: 100%;
  position: absolute;
  top: 0px;
  cursor: pointer;
  clip-path: ${p => p.open ? 'polygon(91px 0px,89px 100%,335px 100%,335px 16px,356px 16px,356px 40px,335px 40px,335px 100%, 100% 100%,100% 0px)' : 'none'};
`;

export const HyloBox = ({
  src = "https://www.hylo.com/groups/loud-cacti/explore",
  rect,
}: {
  src?: string;
  rect: DOMRect;
}) => {
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const height = window.innerHeight - Math.max(0, rect.top);
  return (
    <HyloDragger
      height={height}
      width={rect.width}
      left={rect.left}
      headerHeight={56}
      open={open}
      hovering={hovering}
    >
      <HyloIFrame src={src} title="Hylo Group" frameBorder="0"></HyloIFrame>
      <HeaderClick
        open={open}
        headerHeight={56}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      />
    </HyloDragger>
  );
};
