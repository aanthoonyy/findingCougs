import { Box, Paper, Typography } from "@mui/material";

interface FeedProps {
  feed: Array<{
    text: string;
    createdAt: string;
    authorName: string;
    authorId: string;
  }>;
  userId?: string;
  userName?: string;
}

export default function Feed({ feed, userId }: FeedProps) {
  const title = userId ? "Your Posts" : "Feed";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ flexShrink: 0, color: "#981E32" }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
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
        {Array.isArray(feed) && feed.length > 0 ? (
          feed.map((post) => (
            <Paper
              key={`${post.authorId}-${post.createdAt}`}
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
              <Typography paragraph>{post.text}</Typography>
              <Typography variant="caption" sx={{ color: "#5E6A71" }}>
                {!userId && `@${post.authorName} | `}
                {new Date(post.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography sx={{ color: "#5E6A71" }} align="center">
            No posts to display
          </Typography>
        )}
      </Box>
    </Box>
  );
}
