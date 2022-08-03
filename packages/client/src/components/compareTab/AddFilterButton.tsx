import { useCallback, useState, MouseEvent, useMemo } from "react";
import {
  FilterParamDataSource,
  useAddFilter,
  useFilters,
} from "../../states/filters";
import { useShowFilterEditor } from "../../states/sidePanelContent";
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
import { useAuth } from "../../states/auth";

const createOptionFilterParam = (key: string, options: string[]) => ({
  active: true,
  dataSource: FilterParamDataSource.FarmOnboarding,
  key,
  value: { options },
});

export const AddFilterButton = () => {
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
  const [farmDomainsOpen, setFarmDomainsOpen] = useState(false);
  const toggleFarmDomainsOpen = useCallback(
    (e) => {
      e.stopPropagation();
      setFarmDomainsOpen(!farmDomainsOpen);
    },
    [farmDomainsOpen]
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
  const [organizationsOpen, setOrganizationsOpen] = useState(false);
  const toggleOrganizationsOpen = useCallback(
    (e) => {
      e.stopPropagation();
      setOrganizationsOpen(!organizationsOpen);
    },
    [organizationsOpen]
  );

  return (
    <>
      <Button
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
        {connectedFarmIds?.length
          ? [
              <MenuItem key="my-params" onClick={handleAddFarmDomainsFilter}>
                Filter My Farms <Box flexGrow={1} />
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={toggleFarmDomainsOpen}
                >
                  {farmDomainsOpen ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </MenuItem>,
              <Collapse
                key="farm-domains"
                in={farmDomainsOpen}
                timeout="auto"
                unmountOnExit
              >
                {connectedFarmIds.map((farmDomain) => (
                  <MenuItem
                    key={farmDomain}
                    sx={{ pl: 4 }}
                    onClick={() => handleAddSingleFarmDomainFilter(farmDomain)}
                  >
                    Filter {farmDomain}
                  </MenuItem>
                ))}
              </Collapse>,
            ]
          : []}
        {organizations.length
          ? [
              <MenuItem key="my-params" onClick={handleAddOrganizationsFilter}>
                Filter My Organizations <Box flexGrow={1} />
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={toggleOrganizationsOpen}
                >
                  {organizationsOpen ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </MenuItem>,
              <Collapse
                key="organizations"
                in={organizationsOpen}
                timeout="auto"
                unmountOnExit
              >
                {organizations.map((organization) => (
                  <MenuItem
                    key={organization}
                    sx={{ pl: 4 }}
                    onClick={() =>
                      handleAddSingleOrganizationFilter(organization)
                    }
                  >
                    Filter {organization}
                  </MenuItem>
                ))}
              </Collapse>,
            ]
          : []}
      </Menu>
    </>
  );
};
