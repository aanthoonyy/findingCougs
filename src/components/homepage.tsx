/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import Header from "./Header";
import Post from "./post";
import Feed from "./feed";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  following: Array<{ _id: string; name: string; username: string }>;
  followers: Array<{ _id: string; name: string; username: string }>;
  posts: Array<{ text: string; createdAt: string }>;
}

interface FeedItem {
  text: string;
  createdAt: string;
  authorName: string;
  authorId: string;
}

function Homepage() {
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [processedFeed, setProcessedFeed] = useState<FeedItem[]>([]);
  const [followingAnchor, setFollowingAnchor] = useState<HTMLElement | null>(
    null
  );
  const [followersAnchor, setFollowersAnchor] = useState<HTMLElement | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [navigate]);

  const fetchFeed = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/feed`
      );
      const data = await response.json();
      setFeed(data);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  const handleCreatePost = async (text: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            text: text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error:", data);
        throw new Error(data.message || "Failed to create post");
      }

      // Refresh the feed after creating a new post
      await fetchFeed();
    } catch (err) {
      console.error("Error creating post:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  useEffect(() => {
    if (Array.isArray(feed)) {
      const processed = feed
        .reduce((allPosts: any[], u: any) => {
          const userPosts =
            u.posts?.map((post: any) => ({
              ...post,
              authorName: u.name,
              authorId: u._id,
            })) || [];
          return [...allPosts, ...userPosts];
        }, [])
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setProcessedFeed(processed);
    }
  }, [feed]);

  const handleFollowingHover = (event: React.MouseEvent<HTMLElement>) => {
    setFollowingAnchor(event.currentTarget);
  };

  const handleFollowersHover = (event: React.MouseEvent<HTMLElement>) => {
    setFollowersAnchor(event.currentTarget);
  };

  const handlePopperClose = () => {
    setFollowingAnchor(null);
    setFollowersAnchor(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", overflow: "hidden" }}>
      <Header user={user} />

      <Container
        sx={{ mt: 4, height: "calc(100vh - 64px)", overflow: "hidden" }}
      >
        <Box sx={{ display: "flex", gap: 4, height: "100%" }}>
          <Box sx={{ flex: "0 0 300px", overflow: "hidden" }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  @{user.username}
                </Typography>
                {/* <Typography color="textSecondary" gutterBottom>
                  {user.email}
                </Typography> */}
                <Divider sx={{ my: 2 }} />
                <Typography>
                  <Box
                    component="span"
                    onMouseEnter={handleFollowingHover}
                    onMouseLeave={handlePopperClose}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Following: {user.following.length}
                  </Box>
                  {" | "}
                  <Box
                    component="span"
                    onMouseEnter={handleFollowersHover}
                    onMouseLeave={handlePopperClose}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Followers: {user.followers.length}
                  </Box>
                </Typography>
              </CardContent>
            </Card>
            <Popper
              open={Boolean(followingAnchor)}
              anchorEl={followingAnchor}
              placement="right-start"
              sx={{ zIndex: 1200 }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxHeight: 300,
                  width: 250,
                  overflow: "auto",
                  mt: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Following
                </Typography>
                {user.following.map((follow) => (
                  <Box
                    key={follow._id}
                    sx={{
                      py: 1,
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #eee",
                      },
                    }}
                  >
                    <Typography>
                      {follow.name} ({follow.username || "Null"})
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Popper>
            <Popper
              open={Boolean(followersAnchor)}
              anchorEl={followersAnchor}
              placement="right-start"
              sx={{ zIndex: 1200 }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxHeight: 300,
                  width: 250,
                  overflow: "auto",
                  mt: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Followers
                </Typography>
                {user.followers.map((follower) => (
                  <Box
                    key={follower._id}
                    sx={{
                      py: 1,
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #eee",
                      },
                    }}
                  >
                    <Typography>
                      {follower.name} ({follower.username || "Null"})
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Popper>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ mb: 3, flexShrink: 0 }}>
              <Post onCreatePost={handleCreatePost} />
            </Box>
            <Feed feed={processedFeed} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Homepage;
