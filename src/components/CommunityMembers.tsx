import { List, Paper, Typography } from "@mui/material";

interface Member {
  _id: string;
  name: string;
  username: string;
  email?: string;
}

interface CommunityMembersProps {
  members: Member[];
}

function CommunityMembers({ members }: CommunityMembersProps) {
  return (
    <List>
      {members.map((member) => (
        <Paper
          key={member._id}
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
          <Typography variant="h6" sx={{ color: "#981E32" }}>
            {member.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#5E6A71",
              fontWeight: 500,
            }}
          >
            @{member.username}
          </Typography>
          {member.email && (
            <Typography
              variant="body2"
              sx={{
                color: "#5E6A71",
              }}
            >
              {member.email}
            </Typography>
          )}
        </Paper>
      ))}
    </List>
  );
}

export default CommunityMembers;
