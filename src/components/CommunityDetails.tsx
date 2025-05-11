import React from "react";
import { Box, Button, Paper, Typography, Tabs, Tab } from "@mui/material";
import CommunityPosts from "./CommunityPosts";
import CommunityMembers from "./CommunityMembers";

interface Community {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email?: string;
}

interface UserWithPosts extends User {
  posts?: Array<{
    text: string;
    createdAt: string;
  }>;
}

interface CommunityDetailsProps {
  community: Community;
  feed: UserWithPosts[];
  memberDetails: User[];
  onBack: () => void;
}

function CommunityDetails({
  community,
  feed,
  memberDetails,
  onBack,
}: CommunityDetailsProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
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
          <Typography variant="h5" sx={{ color: "#981E32" }}>
            {community.name}
          </Typography>
          <Button
            onClick={onBack}
            sx={{
              color: "#981E32",
              borderColor: "#981E32",
              "&:hover": {
                backgroundColor: "rgba(152, 30, 50, 0.04)",
              },
            }}
            variant="outlined"
          >
            Back to Communities
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: "#981E32",
            },
            "& .MuiTab-root": {
              color: "#5E6A71",
              "&.Mui-selected": {
                color: "#981E32",
              },
            },
          }}
        >
          <Tab label="Posts" />
          <Tab label="People" />
        </Tabs>

        {activeTab === 0 && <CommunityPosts feed={feed} />}
        {activeTab === 1 && <CommunityMembers members={memberDetails} />}
      </Paper>
    </Box>
  );
}

export default CommunityDetails;
