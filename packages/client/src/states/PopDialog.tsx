import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import MuiPopper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import React, { ComponentProps, ReactNode, useState } from "react";

const Popper = styled(MuiPopper, {
  shouldForwardProp: (prop) => prop !== "arrow",
})(({ theme }) => ({
  zIndex: 1,
  "& > div": {
    position: "relative",
  },
  '&[data-popper-placement*="bottom"]': {
    "& > div": {
      marginTop: 2,
    },
    "& .MuiPopper-arrow": {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${theme.palette.primary.main} transparent`,
      },
    },
  },
  '&[data-popper-placement*="top"]': {
    "& > div": {
      marginBottom: 2,
    },
    "& .MuiPopper-arrow": {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.primary.main} transparent transparent transparent`,
      },
    },
  },
  '&[data-popper-placement*="right"]': {
    "& > div": {
      marginLeft: 2,
    },
    "& .MuiPopper-arrow": {
      left: 0,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
      },
    },
  },
  '&[data-popper-placement*="left"]': {
    "& > div": {
      marginRight: 2,
    },
    "& .MuiPopper-arrow": {
      right: 0,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${theme.palette.primary.main}`,
      },
    },
  },
}));

const Arrow = styled("div")({
  position: "absolute",
  fontSize: 7,
  width: "3em",
  height: "3em",
  "&::before": {
    content: '""',
    margin: "auto",
    display: "block",
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
});


export const PopDialog: React.FC<{
    open?: boolean,
    anchor: ReactNode,
  placement?: ComponentProps<typeof Popper>["placement"];
}> = ({ placement, anchor, open, children }) => {
  const [arrowRef, setArrowRef] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  let child = React.Children.only(anchor);
  if (React.isValidElement(child)) {
    child = React.cloneElement(child, { ...child.props, ref: setAnchorEl });
  } else {
    throw new Error("Child has to be a ReactElement");
  }

  return (
    <>
      {child}
      <Popper
        open={Boolean(anchorEl) && Boolean(open)}
        anchorEl={anchorEl}
        transition
        placement={placement}
        sx={{zIndex: 1200}} // above the Hylo box but below the dropdowns
        modifiers={[
          {
            name: "flip",
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
          {
            name: "arrow",
            enabled: !!arrowRef,
            options: {
              element: arrowRef,
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div>
              <Arrow ref={setArrowRef} className="MuiPopper-arrow" />

              <Paper
                variant="outlined"
                square
                sx={{
                  borderColor: "primary.main",
                  borderWidth: 2,
                  maxWidth: 400,
                }}
              >
                {children}
              </Paper>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
};
