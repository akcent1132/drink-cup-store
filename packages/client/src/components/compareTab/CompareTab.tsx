import { schemeTableau10 } from "d3-scale-chromatic";
import faker from "faker";
import { without, sample } from "lodash";
import { useCallback, useState, MouseEvent } from "react";
import { ROWS } from "../../contexts/rows";
import { useAddFilter, useFilters } from "../../states/filters";
import {
  useHighlightFilter,
  useUnhighlightFilter,
} from "../../states/highlightedFilterId";
import { useShowFilterEditor } from "../../states/sidePanelContent";
import { CropSelector } from "../../stories/CropSelector";
import { NestedRows } from "../../stories/NestedRows";
import { Spacer } from "../EventsCard";
import { FilterLabel } from "../FilterLabel";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { AddFilterButton } from "./AddFilterButton";

const PaneHead = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 20px 20px 20px;
`;

const COLORS = schemeTableau10.slice(0, 9);
let filterNamePostfix = 1;
export const CompareTab = () => {
  const showFilterEditor = useShowFilterEditor();
  const highlightFilter = useHighlightFilter();
  const unhighlightFilter = useUnhighlightFilter();
  const addFilter = useAddFilter();
  const filters = useFilters();
  const handleAddFilter = useCallback(
    (name?: string, color?: string) => {
      // const freeColors = without(COLORS, ...filters.map((g) => g.color));
      // name = name || faker.company.companyName();
      // const _color =
      //   color || sample(freeColors.length > 0 ? freeColors : COLORS)!;
      // const filter = addFilter(_color, `New Filter ${filterNamePostfix++}`);
      // showFilterEditor(filter.id);
    },
    [filters]
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [farmDomainsOpen, setFarmDomainsOpen] = useState(false);
  const toggleFarmDomainsOpen = useCallback(
    (e) => {
      e.stopPropagation();
      setFarmDomainsOpen(!farmDomainsOpen);
    },
    [farmDomainsOpen]
  );

  return (
    <RowContainer>
      <PaneHead>
        <CropSelector />
        <Spacer />
        {[...filters].reverse().map((filter) => (
          <FilterLabel
            key={filter.id}
            filterId={filter.id}
            label={filter.name}
            color={filter.color}
            onMouseEnter={() => highlightFilter(filter.id)}
            onMouseLeave={() => unhighlightFilter(filter.id)}
            isWide
            showActions
          />
        ))}
        <AddFilterButton/>
      </PaneHead>
      <NestedRows rows={ROWS} filters={filters} />
    </RowContainer>
  );
};
