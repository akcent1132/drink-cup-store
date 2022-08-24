import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../states/auth";
import {
  FilterParamDataSource,
  useAddFilter,
  useFilters
} from "../../states/filters";
import { useShowFilterEditor } from "../../states/sidePanelContent";
import { useAddFilterButtonQuery } from "./AddFilterButton.generated";
import { DropMenuItem } from "./DropMenuItem";

const createOptionFilterParam = (key: string, options: string[]) => ({
  active: true,
  dataSource: FilterParamDataSource.FarmOnboarding,
  key,
  value: { options },
});

export const AddFilterButton = React.forwardRef<HTMLButtonElement>((_, ref) => {
  const auth = useAuth();
  const { data: { connectedFarmIds, surveyStackGroups } = {} } =
    useAddFilterButtonQuery({
      variables: { userId: (auth.isAuthenticated && auth.user.id) || null },
    });
  const organizations = useMemo(
    () => (surveyStackGroups || []).map((g) => g.name),
    [surveyStackGroups]
  );
  const addFilter = useAddFilter();
  const filters = useFilters();
  const showFilterEditor = useShowFilterEditor();
  const handleAddFilter = useCallback(() => {
    setAnchorEl(null);
    const filterId = addFilter();
    showFilterEditor(filterId);
  }, [filters.map((f) => f.color).join()]);

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

  // Farm Domains
  const handleAddFarmDomainsFilter = useCallback(() => {
    setAnchorEl(null);
    connectedFarmIds &&
      addFilter({
        name: "My Farms",
        params: [createOptionFilterParam("farmDomain", connectedFarmIds)],
      });
  }, [connectedFarmIds]);
  const handleAddSingleFarmDomainFilter = useCallback(
    (farmDomain: string) => {
      setAnchorEl(null);
      connectedFarmIds &&
        addFilter({
          name: farmDomain,
          params: [createOptionFilterParam("farmDomain", [farmDomain])],
        });
    },
    [connectedFarmIds]
  );

  // Organizations
  const handleAddOrganizationsFilter = useCallback(() => {
    setAnchorEl(null);
    connectedFarmIds &&
      addFilter({
        name: "My Organizations",
        params: [createOptionFilterParam("organization", organizations)],
      });
  }, [connectedFarmIds]);
  const handleAddSingleOrganizationFilter = useCallback(
    (organization: string) => {
      setAnchorEl(null);
      connectedFarmIds &&
        addFilter({
          name: organization,
          params: [createOptionFilterParam("organization", [organization])],
        });
    },
    [connectedFarmIds]
  );

  return (
    <>
      <Button
      ref={ref}
        size="medium"
        id="basic-button"
        startIcon={<AddIcon />}
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
          <DropMenuItem
            onAddMain={handleAddFarmDomainsFilter}
            mainLabel=" Filter My Farms"
            onAddSubmenu={handleAddSingleFarmDomainFilter}
            submenuValues={connectedFarmIds}
          />
        ) : null}

        {organizations.length ? (
          <DropMenuItem
            onAddMain={handleAddOrganizationsFilter}
            mainLabel="Filter My Organizations"
            onAddSubmenu={handleAddSingleOrganizationFilter}
            submenuValues={organizations}
          />
        ) : null}
      </Menu>
    </>
  );
});
