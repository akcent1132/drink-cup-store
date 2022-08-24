import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import MuiPopper from "@mui/material/Popper";
import { createTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { ComponentProps, useRef, useState } from "react";
import { theme } from "../theme/theme";
import {
  Stop,
  Stops,
  useBack,
  useCurrentStop,
  useIsTourOn,
  useNext,
  useSetIsTourOn,
} from "./tour";
import { useIsAuthDialogOpen } from "./ui";

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

const getStopDetails = (stop: Stop) => {
  switch (stop) {
    case Stop.SELECT_CROP:
      return { text: "Select the crop you want to benchmark." };
    case Stop.FILTER:
      return {
        text: "Filter available plantings to make comparisons between groups, conditions, practices, etc.",
      };
    case Stop.HOVER_VALUE:
      return {
        text: "Hover over a planting to see how it compares to others.",
      };
    case Stop.OPEN_PLANTING:
      return {
        text: "Click it to see details and more plantings from that producer.",
      };
    case Stop.DISCUSS:
      return {
        text: "Discuss what you see with your producer groups.",
      };
  }
};

const lightTheme = createTheme({ palette: { mode: "light" } });

export const TourStop: React.FC<{
  stop: Stop;
  placement?: ComponentProps<typeof Popper>["placement"];
}> = ({ stop, placement, children }) => {
  const [arrowRef, setArrowRef] = useState<any>(null);
  const isAuthDialogOpen = useIsAuthDialogOpen();
  const currentStop = useCurrentStop();
  const isTourOn = useIsTourOn();
  const setIsTourOn = useSetIsTourOn();
  const next = useNext();
  const back = useBack();

  // const anchorEl = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const open =
    Boolean(anchorEl) && !isAuthDialogOpen && isTourOn && currentStop === stop;
  const id = open ? "simple-popover" : undefined;
  const activeStep = Stops.indexOf(stop);

  let child = React.Children.only(children);
  if (React.isValidElement(child)) {
    child = React.cloneElement(child, { ...child.props, ref: setAnchorEl });
  } else {
    throw new Error("Child has to be a ReactElement");
  }

  return (
    <>
      {child}
      {/* <div ref={setAnchorEl}>{children}</div> */}
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement={placement}
        sx={{zIndex: 3000}}
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
          // {
          //   name: "preventOverflow",
          //   enabled: true,
          //   options: {
          //     altAxis: true,
          //     altBoundary: true,
          //     tether: true,
          //     rootBoundary: "document",
          //     padding: 8,
          //   },
          // },
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
                <Typography sx={{ p: 2 }}>
                  {getStopDetails(stop).text}
                </Typography>
                <Box sx={{ display: "flex", px: 1 }}>
                  <Button
                    size="small"
                    sx={{ my: 1 }}
                    onClick={() => setIsTourOn(false)}
                  >
                    Skip Tour
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <MobileStepper
                    variant="dots"
                    steps={Stops.length}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                      <Button size="small" onClick={next}>
                        {activeStep === Stops.length - 1 ? "Finish" : "Next"}
                        {theme.direction === "rtl" ? (
                          <KeyboardArrowLeft />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={back}
                        disabled={activeStep === 0}
                      >
                        {theme.direction === "rtl" ? (
                          <KeyboardArrowRight />
                        ) : (
                          <KeyboardArrowLeft />
                        )}
                        Back
                      </Button>
                    }
                  />
                </Box>
              </Paper>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
};
