import styled from "@emotion/styled";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { isNil, remove, sortBy } from "lodash";
import React, { useCallback, useMemo } from "react";
import useCopy from "use-copy";
import { PopDialog } from "../../states/PopDialog";
import { getEventIcon } from "./IconEventsBar";
import { PlantingCardListQuery } from "./PlantingCardList.generated";

export const defaultTheme = {
  borderColor: "rgba(255,255,255,.4)",
  backgroundColor: "#181818",
  textColor: "#ffffff",
  textSize: 16,
  arrowSize: 8,
  height: 20,
};

const Container = styled.div<{ x: number; y: number }>`
  width: 0;
  height: 0;
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

interface Props {
  title: string;
  date: string;
  x: number;
  y: number;
  onClose?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  eventDetails?: NonNullable<
    NonNullable<PlantingCardListQuery["plantings"][number]>["events"]
  >[number]["details"];
  debugInfo?: any;
}

export const EventDetailsPopup: React.FC<Props> = ({
  date,
  title,
  x,
  y,
  onClose,
  onMouseEnter,
  onMouseLeave,
  debugInfo,
  eventDetails,
}) => {
  const theme = useTheme();
  const [details, name] = useMemo(() => {
    const detailsLeft = [...(eventDetails || [])];
    const name = detailsLeft.find(
      (detail) => detail.name.toLowerCase() === "name"
    );
    // Hide drupal_uid for now, later we might use it to generate direct link the the FarmOS page
    const blacklist = ["drupal_uid", "name", "date"];
    remove(detailsLeft, (detail) =>
      blacklist.includes(detail.name.toLowerCase())
    );
    // Remove empty details
    remove(
      detailsLeft,
      (detail) => isNil(detail.value) && isNil(detail.valueList)
    );
    // Make sure class comes first
    const details = sortBy(detailsLeft, [
      (detail) => (["class"].includes(detail.name.toLowerCase()) ? -1 : 0),
      (detail) => detail.name,
    ]);
    return [details, name];
  }, [eventDetails]);

  const [copied, copy, setCopied] = useCopy(
    JSON.stringify({ title, date, debugInfo, ...details }, null, 2)
  );

  const copyData = useCallback(() => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copy, setCopied]);

  const Icon = getEventIcon(title.toLowerCase());
  return (
    <PopDialog open anchor={<Container {...{ x, y }} />}>
      <Box
        sx={{ mx: 1 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Box sx={{ display: "flex", direction: "row", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" component="div">
              {title}
            </Typography>

            {name?.value ? (
              <Typography color="primary">{name.value}</Typography>
            ) : null}
            <Typography color="text.secondary">{date}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ ml: 2, mt: 1, alignSelf: "flex-start" }}>
            <Icon
              width="42px"
              height="42px"
              color="white"
              style={{ fill: theme.palette.primary.main }}
            />
          </Box>
        </Box>

        {eventDetails ? (
          <Table size="small" sx={{ mt: 2 }}>
            <TableBody>
              {details.map((detail) => (
                <TableRow
                  key={detail.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {detail.name}
                  </TableCell>
                  <TableCell align="right">
                    {detail.valueList ? (
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {detail.valueList.map((v, i) => (
                          <Chip label={v} key={i} size="small" />
                        ))}
                      </Stack>
                    ) : (
                      detail.value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "loading..."
        )}
        <CardActions>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={copied ? "Copied!" : "Copy data"}>
            <IconButton
              onClick={copyData}
              color={copied ? "success" : undefined}
            >
              {copied ? <CheckIcon /> : <CopyAllIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="close">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Box>
    </PopDialog>
  );
};
