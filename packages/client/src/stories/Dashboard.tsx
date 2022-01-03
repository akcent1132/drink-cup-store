import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import '../index.css';
import { useCanvas } from "../utils/useCanvas";
import bgImage from "../assets/images/Background-corngrains.jpg";

// TODO read height from props

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${bgImage});
  background-size: cover;
`;

interface Props {
  /**
   * Data name
   */
  label: string;
}

/**
 * Primary UI component for user interaction
 */
export const Dashboard = ({
  label,
}: Props) => {

  return (
    <Root>
    </Root>
  );
};
