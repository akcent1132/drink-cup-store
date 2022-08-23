import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useCallback, useEffect, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuth, useLogout } from "../../states/auth";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useSetIsAuthDialogOpen } from "../../states/ui";
import { useStartTour } from "../../states/tour";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const AuthMenu = () => {
  const logout = useLogout();
  const setIsAuthDialogOpen = useSetIsAuthDialogOpen();
  const auth = useAuth();
  // Open SignIn dialog on start if user is not logged in
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setIsAuthDialogOpen(true);
    }
  }, []);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignIn = useCallback(() => {
    setIsAuthDialogOpen(true);
    setAnchorEl(null);
  }, []);

  const startTour = useStartTour();

  return (
    <Stack direction="row" alignItems="center">
      {auth.isAuthenticated ? (
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              {/* <ListItemIcon>
          <Cloud fontSize="small" />
        </ListItemIcon> */}
              <ListItemText>{auth.user.email}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button onClick={handleSignIn}>Sign in</Button>
      )}
      <Tooltip title="Start Tour">
        <IconButton onClick={startTour}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
