import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import {
  NotificationType,
  useNotifications,
  useRemoveAllNotifications,
  useRemoveNotification,
} from "../states/ui";

export const Notifications = () => {
  const notifications = useNotifications();
  const removeAllNotofocations = useRemoveAllNotifications();
  const removeNotification = useRemoveNotification();

  const first = notifications[0] || null;
  return first ? (
    <Snackbar
      key={first.id}
      open={true}
      onClose={() => removeNotification(first.id)}
    >
      <Alert
        severity={first.type === NotificationType.ERROR ? "error" : "info"}
        sx={{ width: "100%" }}
        action={[
          notifications.length > 1 ? (
            <Button
              color="inherit"
              size="small"
              onClick={removeAllNotofocations}
            >
              Close all ({notifications.length})
            </Button>
          ) : null,
          <IconButton
            color="inherit"
            size="small"
            onClick={() => removeNotification(first.id)}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      >
        {first.message}
      </Alert>
    </Snackbar>
  ) : null;
};
