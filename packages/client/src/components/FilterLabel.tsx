import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import "../index.css";
import tinycolor from "tinycolor2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFiltersContext } from "../contexts/FiltersContext";

export const defaultTheme = {
  height: 30,
};

const Root = withTheme(styled.button<{ color: string }>`
  /* reset style */
  font-family: ${(props) => props.theme.fonts.baseBold};
  font-size: 100%;
  margin: 0;
  overflow: hidden;
  text-transform: none;
  -webkit-appearance: button;

  position: relative;
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

const Actions = withTheme(styled.div<{ color: string; isVisible: boolean }>`
  height: 100%;
  border-radius: 15px;
  height: 30px;
  line-height: 31px;
  font-size: 15px;
  border-width: 0;
  background-color: ${(props) => props.theme.color(props.color)};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  dispaly: flex;
  align-items: center;
  padding: 0 5px;
`);

// TODO use button
const ActionButton = withTheme(styled.div`
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  color: ${(p) => p.theme.colors.textPrimary};
  padding: 0 2px;
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
  filterId: string;
  showActions?: boolean;
}

export const FilterLabel = ({
  label,
  color = "green",
  onClick,
  onMouseEnter,
  onMouseLeave,
  filterId,
  className,
  isWide = false,
  showActions,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [_, dispatch] = useFiltersContext();
  const handleHover = useCallback(() => {
    setIsHovered(true);
    onMouseEnter && onMouseEnter();
  }, [onMouseEnter]);
  const handleLeave = useCallback(() => {
    setIsHovered(false); onMouseLeave && onMouseLeave();
  }, [onMouseLeave]);
  const handleDelete = useCallback(
    () => dispatch({ type: "delete", filterId }),
    []
  );
  const handleSelect = useCallback(
    () => dispatch({ type: "select", filterId }),
    []
  );
  return (
    <Root
      {...{ color, onClick, className }}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <Padding isWide={isWide} />
      <Caption>{label}</Caption>
      <Padding isWide={isWide} />
      {showActions ? (
        <Actions isVisible={isHovered} color={color}>
          <ActionButton onClick={handleSelect}>
            <EditIcon fontSize="inherit" />
          </ActionButton>
          <ActionButton onClick={handleDelete}>
            <DeleteIcon fontSize="inherit" />
          </ActionButton>
        </Actions>
      ) : null}
    </Root>
  );
};
