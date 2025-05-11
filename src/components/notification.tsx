/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Paper } from "@mui/material";
import NotificationList from "./NotificationList";
import Header from "./Header";

interface User {
  _id: string;
  name: string;
  username: string;
  following: Array<{ _id: string }>;
}

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

// Mock data for testing - replace with actual API calls
const mockNotifications = [
  {
    _id: "1",
    sender: {
      name: "John Doe",
      username: "johndoe",
    },
    type: "follow",
    read: false,
    createdAt: new Date().toISOString(),
  },
  // Add more mock notifications as needed
];

function Notification() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    fetchFullUser(parsedUser._id);
  }, [navigate]);

  const fetchFullUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        navigate("/login");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      navigate("/login");
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/notifications`
      );
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header user={user} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderTop: 3,
            borderColor: "#981E32",
            boxShadow: "0 2px 8px rgba(94, 106, 113, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, color: "#981E32" }}
          >
            Notifications
          </Typography>
          <Box
            sx={{
              maxHeight: "calc(100vh - 300px)",
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#5E6A71",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#4a5459",
              },
            }}
          >
            <NotificationList notifications={notifications} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Notification;
