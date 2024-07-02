import Button from "@mui/material/Button";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useCallback, useMemo } from "react";
import {
  useHighlightFilter,
  useUnhighlightFilter,
} from "../states/highlightedFilterId";
import { useShowFilterEditor } from "../states/sidePanelContent";

export const defaultTheme = {};

interface Props {
  color: string;
  label: string;
  filterId: string;
}

export const FilterLabel = ({ label, color = "green", filterId }: Props) => {
  const showFilterEditor = useShowFilterEditor();

  const highlightFilter = useHighlightFilter();
  const unhighlightFilter = useUnhighlightFilter();

  const handleSelect = useCallback(() => {
    showFilterEditor(filterId);
  }, []);
  const theme = useMemo(
    () => createTheme({ palette: { primary: { main: color } } }),
    [color]
  );
  return (
    <ThemeProvider theme={theme}>
      <Button
        color="primary"
        variant="contained"
        size="small"
        sx={{ borderRadius: 3, overflow: "hidden" }}
        onMouseEnter={() => highlightFilter(filterId)}
        onMouseLeave={() => unhighlightFilter(filterId)}
        onClick={handleSelect}
      >
        {label}
      </Button>
    </ThemeProvider>
  );
};
