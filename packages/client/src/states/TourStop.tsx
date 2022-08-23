import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import MuiPopper from "@mui/material/Popper";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useRef, useState } from "react";
import { Stop, useCurrentStop } from "./tour";

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
      return { text: "select the crop you want to benchmark" };
    case Stop.FILTER:
      return {
        text: "filter available plantings to make comparisons between groups, conditions, practices, etc.",
      };
    case Stop.HOVER_VALUE:
      return {
        text: "Click it to see details and more plantings from that producer",
      };
    case Stop.OPEN_PLANTING:
      return {
        text: "hover over a planting to see how it compares to others.",
      };
  }
};

const lightTheme = createTheme({ palette: { mode: "light"} })

export const TourStop: React.FC<{ stop: Stop }> = ({ stop, children }) => {
  const [arrowRef, setArrowRef] = useState<any>(null);
  const currentStop = useCurrentStop();

  const anchorEl = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl.current);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div ref={anchorEl}>{children}</div>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl.current}
        transition
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
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
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
              
              <Paper variant="outlined" square sx={{borderColor: 'primary.main', borderWidth: 2}}>
                <Typography sx={{ p: 2 }}>
                  {getStopDetails(currentStop).text}
                </Typography>
                <Box sx={{display: 'flex', pb: 1, px: 1}}>
                  <Button>Skip Tour</Button><Box sx={{ flexGrow: 1 }}/><Button variant="contained" color="primary">Next</Button>
                </Box>
              </Paper>
           </div>
          </Fade>
        )}
      </Popper>
    </>
  );
};
