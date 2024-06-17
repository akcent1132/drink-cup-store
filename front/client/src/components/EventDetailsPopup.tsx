import React, { useCallback, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { css, withTheme } from "@emotion/react";
import "../index.css";
import {
  Box,
  Card,
  Tag,
  Drop,
  Heading,
  NameValueList,
  NameValuePair,
  Text,
  Button,
} from "grommet";
import { getEventIcon } from "./IconEventsBar";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Spacer } from "./EventsCard";
import useCopy from "use-copy";
import { EventsCardQuery } from "./EventsCard.generated";
import { keyBy, mapValues } from "lodash";
import { getEventDetailsVar } from "../contexts/FiltersContext";
import { makeVar, useReactiveVar } from "@apollo/client";

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
    EventsCardQuery["planting"]
  >["events"][number]["details"];
  debugInfo?: any;
}

export const EventDetailsPopup = ({
  title,
  date,
  x,
  y,
  onClose,
  onMouseEnter,
  onMouseLeave,
  debugInfo,
}: Props) => {
  const [target, setTarget] = useState(null);
  const ref = useCallback((node) => setTarget(node), []);
  const eventDetailsVar = getEventDetailsVar(debugInfo.detailsKey);
  const eventDetails = useReactiveVar(eventDetailsVar);

  console.log("POPUP", { eventDetails });
  const data = mapValues(
    keyBy(eventDetails, "name"),
    (d) => d.value || d.valueList || "N/A"
  );
  // const data = useMemo(
  //   () => ({
  //     Name: "Herbicide Spark 65P 30 liter_acre",
  //     Notes:
  //       "Added 300 liters of Spark total but diluted it with extra water for this field.",
  //     "Quantity 1": "Spark 65P (rate) 30 litre_acre",
  //     "Quantity 2": "Spark 65P (quantity) 300 litre",
  //     "Material 1": ["Spark 65P"],
  //     Flags: ["Greenhouse", "Organic"],
  //   }),
  //   []
  // );
  const [copied, copy, setCopied] = useCopy(
    JSON.stringify({ title, date, debugInfo, ...data }, null, 2)
  );

  const copyData = useCallback(() => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copy, setCopied]);

  const dropAlign = useMemo(() => ({ top: "bottom" as "bottom" }), []);

  const Icon = getEventIcon(title.toLowerCase());
  return (
    <>
      <Container ref={ref} {...{ x, y }}></Container>
      {target ? (
        <Drop
          target={target}
          margin="small"
          responsive
          align={dropAlign}
          onClickOutside={onClose}
          onEsc={onClose}
          plain
        >
          <Card
            style={{ margin: "0 23px", width: "400px" }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Box
              background="light-4"
              pad="small"
              direction="row"
              align="center"
            >
              <Box direction="column" align="flex-start" gap="none" flex="grow">
                <Heading level={3} margin="none">
                  {title}
                </Heading>

                <Text size="small">{date}</Text>
              </Box>

              <Icon
                width="42px"
                height="42px"
                css={css`
                  margin-left: 6px;
                `}
              />
            </Box>
            <Box
              pad="small"
              background="light-3"
              css={css`
                padding-bottom: 4px;
              `}
            >
              {eventDetails ? (
                <NameValueList>
                  {Object.entries(data || {}).map(([key, value]) => (
                    <NameValuePair name={key} key={key}>
                      {Array.isArray(value) ? (
                        <Box direction="row" gap="2px">
                          {value.map((v, i) => (
                            <Tag size="xsmall" value={v} key={i} />
                          ))}
                        </Box>
                      ) : typeof value === "string" ? (
                        <Text size="xsmall" color="text-strong">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </NameValuePair>
                  ))}
                </NameValueList>
              ) : (
                "loading..."
              )}
            </Box>
            <Box background="light-4" pad="none" direction="row">
              <Spacer />
              <Button
                icon={copied ? <CheckIcon /> : <CopyAllIcon />}
                onClick={copyData}
                tip={{
                  plain: true,
                  content: (
                    <Box
                      background="light-1"
                      elevation="small"
                      margin="xsmall"
                      pad={{ vertical: "xsmall", horizontal: "small" }}
                      round="small"
                      align="center"
                    >
                      {copied ? "Copied!" : "Copy data"}
                    </Box>
                  ),
                }}
                color={copied ? "brand" : undefined}
              />
              <Button
                style={{ paddingLeft: 0 }}
                icon={<CloseIcon />}
                onClick={onClose}
                tip={{
                  plain: true,
                  content: (
                    <Box
                      background="light-1"
                      elevation="small"
                      margin="xsmall"
                      pad={{ vertical: "xsmall", horizontal: "small" }}
                      round="small"
                      align="center"
                    >
                      Close
                    </Box>
                  ),
                }}
              />
            </Box>
          </Card>
        </Drop>
      ) : null}
    </>
  );
};
function useFetch<T>(url: any): { data: any; error: any } {
  throw new Error("Function not implemented.");
}
