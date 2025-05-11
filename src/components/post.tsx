/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../design/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export interface PostProps {
  onCreatePost: (text: string) => Promise<void>;
}

export default function Post({ onCreatePost }: PostProps) {
  const [postText, setPostText] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      await onCreatePost(postText);
      setPostText("");
    } catch (err) {
      console.error("Error creating post:", err);
      alert(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderTop: 2,
        borderColor: "#981E32",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom sx={{ color: "#981E32" }}>
          Create a Post
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPostText(e.target.value)
          }
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#5E6A71",
              },
              "&:hover fieldset": {
                borderColor: "#981E32",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#981E32",
              },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!postText.trim()}
            sx={{
              backgroundColor: "#981E32",
              "&:hover": {
                backgroundColor: "#801929",
              },
              "&.Mui-disabled": {
                backgroundColor: "#5E6A71",
              },
            }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
