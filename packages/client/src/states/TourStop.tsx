import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import React, { ComponentProps } from "react";
import { theme } from "../theme/theme";
import { PopDialog } from "./PopDialog";
import {
  Stop,
  Stops,
  useBack,
  useCurrentStop,
  useIsTourOn,
  useNext,
  useSetIsTourOn
} from "./tour";
import { useIsAuthDialogOpen } from "./ui";


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

export const TourStop: React.FC<{
  stop: Stop;
  placement?: ComponentProps<typeof PopDialog>["placement"];
}> = ({ stop, placement, children }) => {
  const isAuthDialogOpen = useIsAuthDialogOpen();
  const currentStop = useCurrentStop();
  const isTourOn = useIsTourOn();
  const setIsTourOn = useSetIsTourOn();
  const next = useNext();
  const back = useBack();

  const open = !isAuthDialogOpen && isTourOn && currentStop === stop;

  const activeStep = Stops.indexOf(stop);


  return (
    <PopDialog placement={placement} open={open} anchor={children}>
      <Typography sx={{ p: 2 }}>{getStopDetails(stop).text}</Typography>
      <Box sx={{ display: "flex", px: 1 }}>
        <Button size="small" sx={{ my: 1 }} onClick={() => setIsTourOn(false)}>
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
            <Button size="small" onClick={back} disabled={activeStep === 0}>
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
    </PopDialog>
  );
};
