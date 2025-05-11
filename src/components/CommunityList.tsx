import { useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";

interface Community {
  _id: string;
  name: string;
  description: string;
  members: string[];
}

interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  following: Array<{ _id: string }>;
}

interface CommunityListProps {
  communities: Community[];
  user: User;
  onSelectCommunity: (community: Community) => void;
  onJoin: (communityId: string) => void;
  onLeave: (communityId: string) => void;
}

function CommunityList({
  communities,
  user,
  onSelectCommunity,
  onJoin,
  onLeave,
}: CommunityListProps) {
  const [showOnlyUnjoined, setShowOnlyUnjoined] = useState(false);

  const filteredCommunities = showOnlyUnjoined
    ? communities.filter(
        (community) =>
          !community.members.some(
            (member) => member.toString() === user._id.toString()
          )
      )
    : communities;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderTop: 3,
        borderColor: "#981E32",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#981E32", mb: 0 }}>
          Communities
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyUnjoined}
              onChange={(e) => setShowOnlyUnjoined(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#981E32",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#981E32",
                },
              }}
            />
          }
          label="unjoined"
        />
      </Box>

      {filteredCommunities.length === 0 ? (
        <Typography>No communities available.</Typography>
      ) : (
        <List>
          {filteredCommunities.map((community) => {
            const isMember = community.members.some(
              (member) => member.toString() === user._id.toString()
            );
            return (
              <ListItem
                key={community._id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #e0e0e0",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(152, 30, 50, 0.04)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  onClick={() => onSelectCommunity(community)}
                  sx={{
                    cursor: "pointer",
                    color: "#981E32",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {community.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    my: 1,
                    color: "#5E6A71",
                  }}
                >
                  Members: {community.members.length}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {community.description}
                </Typography>
                <Button
                  variant={isMember ? "outlined" : "contained"}
                  sx={{
                    backgroundColor: isMember ? "transparent" : "#981E32",
                    color: isMember ? "#981E32" : "#ffffff",
                    borderColor: "#981E32",
                    "&:hover": {
                      backgroundColor: isMember
                        ? "rgba(152, 30, 50, 0.04)"
                        : "#801929",
                      borderColor: "#801929",
                    },
                  }}
                  onClick={() =>
                    isMember ? onLeave(community._id) : onJoin(community._id)
                  }
                >
                  {isMember ? "Leave" : "Join"}
                </Button>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}

export default CommunityList;
