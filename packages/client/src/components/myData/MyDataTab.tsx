import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { schemeTableau10 } from "d3-scale-chromatic";
import { sortBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ROWS } from "../../contexts/rows";
import { useAuth } from "../../states/auth";
import { Filter, FilterParamDataSource } from "../../states/filters";
import { CropSelector } from "../../stories/CropSelector";
import { NestedRows } from "../../stories/NestedRows";
import { AuthMenu } from "./AuthMenu";
import Login from "./Login";
import { useMyDataTabQuery } from "./MyDataTab.generated";

export const MyDataTab = () => {
  const auth = useAuth();
  const { data: { connectedFarmIds: unsortedFarmIds } = {} } =
    useMyDataTabQuery();
  const connectedFarmIds = useMemo(
    () => sortBy(unsortedFarmIds),
    [unsortedFarmIds]
  );
  const [selectedFarmIds, setSelectedFarmIds] = useState(
    connectedFarmIds || []
  );
  useEffect(() => {
    if (connectedFarmIds && connectedFarmIds.length > 0) {
      setSelectedFarmIds(connectedFarmIds);
    }
  }, [connectedFarmIds]);
  const farmdomainFilter: Filter = useMemo(
    () => ({
      color: schemeTableau10[6],
      id: Math.random().toString(),
      name: "My Data",
      params: [
        {
          active: true,
          dataSource: FilterParamDataSource.FarmOnboarding,
          key: "farmDomain",
          value: { options: connectedFarmIds || [] },
        },
      ],
    }),
    [auth]
  );
  const handleChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedFarmIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  }, []);
  return (
    <>
      {auth.isAuthenticated ? (
        <Stack>
          <Stack direction="row" gap={1}>
            <CropSelector />
            <FormControl fullWidth size="small">
              <InputLabel id="my-farm-domains">My Farm Domains</InputLabel>
              <Select
                labelId="my-farm-domains"
                displayEmpty
                multiple
                value={selectedFarmIds}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    placeholder="My Farm Domains"
                    label="My Farm Domains"
                  />
                }
                renderValue={() => "My Farm Domains"}
              >
                {(connectedFarmIds || []).map((farmId) => (
                  <MenuItem key={farmId} value={farmId}>
                    <Checkbox checked={selectedFarmIds?.includes(farmId)} />
                    <ListItemText primary={farmId} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AuthMenu />
          </Stack>
          <NestedRows rows={ROWS} filters={[farmdomainFilter]} />
        </Stack>
      ) : (
        <Login />
      )}
    </>
  );
};
