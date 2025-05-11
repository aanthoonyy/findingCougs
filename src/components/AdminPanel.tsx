import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();
  //0 - Jobs, 1 - Communities, 2 - Users
  const [tabIndex, setTabIndex] = useState(0);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [jobs, setJobs] = useState<any[]>([]);

  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communities, setCommunities] = useState<any[]>([]);

  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchCommunities();
    if (tabIndex === 2) {
      fetchUsers();
    }
  }, [tabIndex]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 2) {
      fetchUsers();
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
          company: jobCompany,
          type: jobType,
        }),
      });
      const data = await response.json();
      if (data._id) {
        alert("Job added successfully!");
        setJobTitle("");
        setJobDescription("");
        setJobCompany("");
        setJobType("full-time");
        fetchJobs();
      } else {
        alert("Failed to add job");
      }
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Error adding job");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${jobId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        alert("Job deleted successfully!");
        fetchJobs();
      } else {
        alert(data.error || "Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Error deleting job");
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await fetch("http://localhost:5000/network");
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      console.error("Error fetching communities:", err);
    }
  };

  const handleAddCommunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: communityName,
          description: communityDescription,
        }),
      });
      const data = await response.json();
      if (data._id) {
        alert("Community added successfully!");
        setCommunityName("");
        setCommunityDescription("");
        fetchCommunities();
      } else {
        alert("Failed to add community");
      }
    } catch (err) {
      console.error("Error adding community:", err);
      alert("Error adding community");
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/network/${communityId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Community deleted successfully!");
        fetchCommunities();
      } else {
        alert(data.error || "Failed to delete community");
      }
    } catch (err) {
      console.error("Error deleting community:", err);
      alert("Error deleting community");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        mb: 4,
      }}
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3, width: "100%" }}
        >
          <Tab label="Jobs" />
          <Tab label="Communities" />
          <Tab label="Users" />
        </Tabs>

        <Box>
          {tabIndex === 0 && (
            <>
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Add a New Job
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleAddJob}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <TextField
                    label="Company"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    required
                    fullWidth
                  />
                  <FormControl fullWidth required>
                    <InputLabel id="job-type-label">Job Type</InputLabel>
                    <Select
                      labelId="job-type-label"
                      value={jobType}
                      label="Job Type"
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <MenuItem value="internship">Internship</MenuItem>
                      <MenuItem value="part-time">Part-Time</MenuItem>
                      <MenuItem value="full-time">Full-Time</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" type="submit">
                    Add Job
                  </Button>
                </Box>
              </Paper>

              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Current Job Listings
                </Typography>
                {jobs.length === 0 ? (
                  <Typography>No jobs available at this time.</Typography>
                ) : (
                  <List>
                    {jobs.map((job) => (
                      <React.Fragment key={job._id}>
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteJob(job._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${job.title} at ${job.company}`}
                            secondary={
                              <>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  component="span"
                                >
                                  {job.description}
                                </Typography>
                                <br />
                                <Typography
                                  variant="caption"
                                  component="span"
                                  sx={{ display: "block" }}
                                >
                                  Type: {job.type} | Applicants:{" "}
                                  {job.applicants.length}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </>
          )}

          {tabIndex === 1 && (
            <>
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Add a New Community
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleAddCommunity}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Community Name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={3}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Add Community
                  </Button>
                </Box>
              </Paper>

              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Current Communities
                </Typography>
                {communities.length === 0 ? (
                  <Typography>
                    No communities available at this time.
                  </Typography>
                ) : (
                  <List>
                    {communities.map((community) => (
                      <React.Fragment key={community._id}>
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() =>
                                handleDeleteCommunity(community._id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={community.name}
                            secondary={community.description}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </>
          )}

          {tabIndex === 2 && (
            <>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  All Users
                </Typography>
                {allUsers.length === 0 ? (
                  <Typography>No users found.</Typography>
                ) : (
                  <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    <List>
                      {allUsers.map((user) => (
                        <React.Fragment key={user._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={`${user.name} (@${user.username})`}
                              secondary={`Email: ${user.email} ${
                                user.suspended ? "(Suspended)" : ""
                              }`}
                            />
                            {!user.suspended && (
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleSuspendUser(user._id)}
                              >
                                Suspend
                              </Button>
                            )}
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default AdminPanel;
