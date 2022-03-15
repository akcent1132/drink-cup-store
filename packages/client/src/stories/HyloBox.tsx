/** @jsxImportSource @emotion/react */

import React, { useLayoutEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import useScrollPosition from "@react-hook/window-scroll";
import { useWindowWidth } from "@react-hook/window-size";

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
  pointer-events: ${(p) => (p.open ? "none" : "auto")};
`;

const CloseEar = styled.div<{ headerHeight: number }>`
  width: ${(p) => p.headerHeight}px;
  height: ${(p) => p.headerHeight}px;
  position: absolute;
  left: -${(p) => p.headerHeight}px;
  top: 0;
  pointer-events: none;
  overflow: hidden;
`;

const CloseEarContent = styled.div<{ open: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: ${(p) => (p.open ? "0" : "100%")};
  width: 100%;
  height: 100%;
  pointer-events: auto;
  border-radius: 5px 0 0 5px;
  background-color: white;
  transition: all 0.3s cubic-bezier(0.14, -0.03, 0.49, 1.02);
  box-shadow: inset rgba(0, 0, 0, 0.15) -7px 0 8px -7px;
  color: rgba(44, 64, 89, 0.6);
  
  svg {

  transition: all 0.1s ease;//cubic-bezier(0.14, -0.03, 0.49, 1.02);
  }
  :hover {
    color: rgba(44, 64, 89, 1.0);
    svg {
      transform: translateY(2px);
    }
  }
`;

export const HyloBox = ({
  src = "https://www.hylo.com/groups/loud-cacti/explore",
  container,
}: {
  src?: string;
  container: React.RefObject<HTMLDivElement>;
}) => {
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  const windowWidth = useWindowWidth();
  const scrollY = useScrollPosition();

  const [rect, setRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    if (container.current) {
      setRect(container?.current.getBoundingClientRect());
    }
  }, [container?.current, windowWidth, scrollY]);
  
  const height = useMemo(() => rect ? window.innerHeight - Math.max(0, rect.top) : 0, [rect?.top]);
  if (!rect) {
    return null
  }
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
      <CloseEar headerHeight={56} onClick={() => setOpen(false)}>
        <CloseEarContent open={open}>
          <ExpandMoreIcon fontSize="large" color="inherit"/>
        </CloseEarContent>
      </CloseEar>
    </HyloDragger>
  );
};

