/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import "../design/main.css";
import "../design/colors.css";
import "../design/shapes.css";
import "../design/alignment.css";
import "../design/text.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileAboutMe from "./profileAboutMe";
import Header from "./Header";
import Feed from "./feed";

interface User {
  _id: string;
  name: string;
  username: string;
  following: Array<{ _id: string }>;
  followers: Array<{ _id: string }>;
  posts: Array<{ text: string; createdAt: string }>;
  major?: string;
  age?: number;
  ethnicity?: string;
  aboutMe?: string;
}

interface SearchResult {
  _id: string;
  name: string;
  username: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [processedPosts, setProcessedPosts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchRef, setSearchRef] = useState<HTMLDivElement | null>(null);
  const [showAboutMe, setShowAboutMe] = useState(false);

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

  useEffect(() => {
    if (user) {
      const processed = user.posts.map((post) => ({
        ...post,
        authorId: user._id,
        authorName: user.name,
      }));
      setProcessedPosts(processed);
    }
  }, [user]);

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

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    if (!newQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${encodeURIComponent(newQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching users:", err);
      alert("Failed to search users");
    }
  };

  const handleFollow = async (targetId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/follow/${targetId}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.success) {
        alert("Followed successfully!");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error following user:", err);
      alert("Failed to follow user");
    }
  };

  const handleCreateAboutMe = async (info: {
    aboutMe: string | null;
    major: string | null;
    age: number | null;
    ethnicity: string | null;
  }) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/aboutme`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(info),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update information");
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Information updated successfully!");
    } catch (error) {
      console.error("Error updating information:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to update information");
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header user={user} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card
          sx={{
            mb: 4,
            borderTop: 3,
            borderColor: "#981E32",
            boxShadow: "0 2px 8px rgba(94, 106, 113, 0.1)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ color: "#981E32" }}
            >
              {user.name}
            </Typography>
            <Typography align="center" sx={{ mb: 2, color: "#5E6A71" }}>
              Following: {user.following.length} | Followers:{" "}
              {user.followers.length}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
            >
              <Button
                variant={!showAboutMe ? "contained" : "outlined"}
                onClick={() => setShowAboutMe(false)}
                sx={{
                  backgroundColor: !showAboutMe ? "#981E32" : "transparent",
                  color: !showAboutMe ? "#ffffff" : "#981E32",
                  borderColor: "#981E32",
                  "&:hover": {
                    backgroundColor: !showAboutMe
                      ? "#801929"
                      : "rgba(152, 30, 50, 0.04)",
                    borderColor: "#801929",
                  },
                }}
              >
                Posts
              </Button>
              <Button
                variant={showAboutMe ? "contained" : "outlined"}
                onClick={() => setShowAboutMe(true)}
                sx={{
                  backgroundColor: showAboutMe ? "#981E32" : "transparent",
                  color: showAboutMe ? "#ffffff" : "#981E32",
                  borderColor: "#981E32",
                  "&:hover": {
                    backgroundColor: showAboutMe
                      ? "#801929"
                      : "rgba(152, 30, 50, 0.04)",
                    borderColor: "#801929",
                  },
                }}
              >
                About Me
              </Button>
            </Box>

            {showAboutMe ? (
              <ProfileAboutMe user={user} onUpdateInfo={handleCreateAboutMe} />
            ) : (
              <Feed
                feed={processedPosts}
                userId={user._id}
                userName={user.name}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Profile;
