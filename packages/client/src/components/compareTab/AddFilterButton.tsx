import { schemeTableau10 } from "d3-scale-chromatic";
import faker from "faker";
import { without, sample } from "lodash";
import { useCallback, useState, MouseEvent } from "react";
import { ROWS } from "../../contexts/rows";
import {
  FilterParamDataSource,
  useAddFilter,
  useFilters,
} from "../../states/filters";
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
import { useAddFilterButtonQuery } from "./AddFilterButton.generated";

const createOptionFilterParam = (
  key: string,
  options: string[]
) => ({
  active: true,
  dataSource: FilterParamDataSource.FarmOnboarding,
  key,
  value: { options },
});

export const AddFilterButton = () => {
  const { data: { connectedFarmIds } = {} } = useAddFilterButtonQuery();
  const addFilter = useAddFilter();
  const filters = useFilters();
  const showFilterEditor = useShowFilterEditor();
  const handleAddFilter = useCallback(() => {
    const filterId = addFilter();
    showFilterEditor(filterId);
  }, [filters.map((f) => f.color).join()]);
  const handleAddFarmDomainsFilter = useCallback(() => {
    connectedFarmIds && addFilter({name: "My Farms", params: [createOptionFilterParam("farmDomain", connectedFarmIds)]});
  }, [connectedFarmIds]);
  const handleAddSingleFarmDomainFilter = useCallback((farmDomain: string) => {
    connectedFarmIds && addFilter({name: farmDomain, params: [createOptionFilterParam("farmDomain", [farmDomain])]});
  }, [connectedFarmIds]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const [farmDomainsOpen, setFarmDomainsOpen] = useState(false);
  const toggleFarmDomainsOpen = useCallback(
    (e) => {
      e.stopPropagation();
      setFarmDomainsOpen(!farmDomainsOpen);
    },
    [farmDomainsOpen]
  );

  return (
    <>
      <Button
        id="basic-button"
        startIcon={<AddIcon />}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpenClick}
      >
        Add
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleAddFilter}>New Filter</MenuItem>
        {connectedFarmIds?.length ? (
          <>
            <MenuItem onClick={handleAddFarmDomainsFilter}>
              Filter My Farms <Box flexGrow={1} />
              <IconButton
              size="small"
              sx={{ml: 2}}
                onClick={toggleFarmDomainsOpen}
              >
                {farmDomainsOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </MenuItem>
            <Collapse in={farmDomainsOpen} timeout="auto" unmountOnExit>
              {connectedFarmIds.map((farmDomain) => (
                <MenuItem sx={{ pl: 4 }} onClick={() => handleAddSingleFarmDomainFilter(farmDomain)}>
                  Filter {farmDomain}
                </MenuItem>
              ))}
            </Collapse>
          </>
        ) : null}
      </Menu>
    </>
  );
};
