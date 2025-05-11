import { Box, Paper, Typography } from "@mui/material";
import Post from "./post";

interface Post {
  text: string;
  createdAt: string;
}

interface ProfilePostsProps {
  posts: Post[];
  userName: string;
  userId?: string;
}

function ProfilePosts({ posts, userName }: ProfilePostsProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Your Posts
      </Typography>
      <Box
        sx={{
          maxHeight: "calc(100vh - 400px)",
          overflow: "auto",
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
        {posts
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography paragraph>{post.text}</Typography>
              <Typography variant="caption" color="textSecondary">
                Created by: {userName} | Created:{" "}
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
}

export default ProfilePosts;
