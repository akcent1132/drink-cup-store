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
import { Spacer } from "./EventsCard";
import useCopy from "use-copy";

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
  isFixed?: boolean;
}

export const EventDetailsPopup = ({
  title,
  date,
  x,
  y,
  onClose,
  isFixed,
}: Props) => {
  const [target, setTarget] = useState(null);
  const ref = useCallback((node) => setTarget(node), []);
  const data = useMemo(
    () => ({
      Name: "Herbicide Spark 65P 30 liter_acre",
      Notes:
        "Added 300 liters of Spark total but diluted it with extra water for this field.",
      "Quantity 1": "Spark 65P (rate) 30 litre_acre",
      "Quantity 2": "Spark 65P (quantity) 300 litre",
      "Material 1": ["Spark 65P"],
      Flags: ["Greenhouse", "Organic"],
    }),
    []
  );
  const [copied, copy, setCopied] = useCopy(JSON.stringify(data, null, 2));

  const copyData = useCallback(() => {
    copy();

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copy, setCopied]);

  const Icon = getEventIcon(title.toLowerCase());
  return (
    <>
      <Container ref={ref} {...{ x, y }}></Container>
      {target ? (
        <Drop
          target={target}
          margin="small"
          responsive
          style={{ pointerEvents: "auto" }}
          align={{ top: "bottom" }}
          onClickOutside={onClose}
          onEsc={onClose}
          background="neutral-1"
        >
          <Card>
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
              <NameValueList>
                {Object.entries(data).map(([key, value]) => (
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
                      background="background-contrast"
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
                size="small"
              />
            </Box>
          </Card>
        </Drop>
      ) : null}
    </>
  );
};
