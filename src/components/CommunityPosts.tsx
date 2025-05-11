import { Box, List, Paper, Typography } from "@mui/material";

interface Post {
  text: string;
  createdAt: string;
}

interface UserWithPosts {
  _id: string;
  name: string;
  posts?: Post[];
}

interface CommunityPostsProps {
  feed: UserWithPosts[];
}

function CommunityPosts({ feed }: CommunityPostsProps) {
  return (
    <List>
      {feed.map((u) => (
        <Box key={u._id}>
          {u.posts?.map((post, idx) => (
            <Paper
              key={idx}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: 2,
                borderColor: "#981E32",
                "&:hover": {
                  backgroundColor: "rgba(152, 30, 50, 0.04)",
                },
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#981E32",
                  fontWeight: 500,
                }}
              >
                Posted by {u.name} on{" "}
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      ))}
    </List>
  );
}

export default CommunityPosts;
