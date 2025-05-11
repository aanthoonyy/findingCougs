import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

interface Notification {
  _id: string;
  sender: {
    name: string;
    username: string;
  };
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  const formatNotificationMessage = (notification: Notification) => {
    switch (notification.type) {
      case "follow":
        return `${notification.sender.name} (@${notification.sender.username}) started following you`;
      case "post":
        return `${notification.sender.name} (@${notification.sender.username}) made a new post`;
      case "comment":
        return `${notification.sender.name} (@${notification.sender.username}) commented on your post`;
      default:
        return `New notification from ${notification.sender.name}`;
    }
  };

  if (notifications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" sx={{ color: "#5E6A71" }}>
          No notifications yet
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {notifications.map((notification, index) => (
        <Box key={notification._id}>
          <ListItem
            alignItems="flex-start"
            sx={{
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: "rgba(152, 30, 50, 0.08)",
              },
            }}
          >
            <ListItemText
              primary={
                <Typography sx={{ color: "#5E6A71" }}>
                  {formatNotificationMessage(notification)}
                </Typography>
              }
              secondary={
                <Typography
                  sx={{ display: "inline", color: "#5E6A71" }}
                  component="span"
                  variant="body2"
                >
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              }
            />
          </ListItem>
          {index < notifications.length - 1 && (
            <Divider
              component="li"
              sx={{ borderColor: "rgba(94, 106, 113, 0.2)" }}
            />
          )}
        </Box>
      ))}
    </List>
  );
}
