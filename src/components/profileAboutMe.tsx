/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export interface User {
  _id: string;
  name: string;
  username: string;
  following: Array<{ _id: string }>;
  followers: Array<{ _id: string }>;
  major?: string;
  age?: number;
  ethnicity?: string;
  aboutMe?: string;
}

export interface ProfileAboutMeProps {
  user: User | undefined;
  onUpdateInfo: (info: {
    aboutMe: string | null;
    major: string | null;
    age: number | null;
    ethnicity: string | null;
  }) => Promise<void>;
}

function ProfileAboutMe({ user, onUpdateInfo }: ProfileAboutMeProps) {
  const [aboutMeText, setAboutMeText] = useState("");
  const [majorText, setMajorText] = useState("");
  const [ageText, setAgeText] = useState("");
  const [ethnicityText, setEthnicityText] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = ageText ? parseInt(ageText, 10) : null;

    if (ageText && !age) {
      alert("Please enter a valid number for age");
      return;
    }

    const info = {
      aboutMe: aboutMeText || null,
      major: majorText || null,
      age: age,
      ethnicity: ethnicityText || null,
    };

    await onUpdateInfo(info);

    // Clear form after successful update
    setAboutMeText("");
    setMajorText("");
    setAgeText("");
    setEthnicityText("");
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Typography>Major: {user?.major || "Not specified"}</Typography>
          <Typography>Age: {user?.age || "Not specified"}</Typography>
          <Typography>
            Ethnicity: {user?.ethnicity || "Not specified"}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          About Me
        </Typography>
        <Typography paragraph>
          {user?.aboutMe || "No about me information yet."}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Update Your Information
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Major"
          value={majorText}
          onChange={(e) => setMajorText(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Age"
          type="number"
          value={ageText}
          onChange={(e) => setAgeText(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Ethnicity"
          value={ethnicityText}
          onChange={(e) => setEthnicityText(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="About Me"
          multiline
          rows={4}
          value={aboutMeText}
          onChange={(e) => setAboutMeText(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Update Information
        </Button>
      </Box>
    </>
  );
}

export default ProfileAboutMe;
