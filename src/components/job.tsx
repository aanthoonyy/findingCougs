/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import Header from "./Header";

function Job() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      let url = "http://localhost:5000/jobs";
      if (jobTypeFilter !== "all") {
        url = `http://localhost:5000/jobs?type=${jobTypeFilter}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [jobTypeFilter, user]);

  const handleApply = async (jobId: string) => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:5000/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Applied successfully!");
        fetchJobs();
      } else {
        alert(data.error || "Failed to apply for job");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header user={user} />

      <Container sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderTop: 3,
            borderColor: "#981E32",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#981E32" }}>
            Recommended Jobs
          </Typography>
          <FormControl sx={{ mb: 4, minWidth: 200 }}>
            <InputLabel id="job-type-filter-label" sx={{ color: "#5E6A71" }}>
              Filter by Type
            </InputLabel>
            <Select
              labelId="job-type-filter-label"
              id="job-type-filter"
              value={jobTypeFilter}
              label="Filter by Type"
              onChange={(e) => setJobTypeFilter(e.target.value)}
              sx={{
                color: "#5E6A71",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#5E6A71",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#981E32",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#981E32",
                },
              }}
            >
              <MenuItem value="all">All Jobs</MenuItem>
              <MenuItem value="internship">Internship</MenuItem>
              <MenuItem value="part-time">Part-Time</MenuItem>
              <MenuItem value="full-time">Full-Time</MenuItem>
            </Select>
          </FormControl>

          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography>Loading jobs...</Typography>
            </Box>
          ) : jobs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography>
                No {jobTypeFilter !== "all" ? jobTypeFilter : ""} jobs available
                at this time.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {jobs.map((job) => {
                const hasApplied = job.applicants.some(
                  (applicant: any) =>
                    applicant.toString() === user._id.toString()
                );
                return (
                  <Paper
                    key={job._id}
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderLeft: 3,
                      borderColor: "#981E32",
                      "&:hover": {
                        boxShadow: 4,
                        backgroundColor: "rgba(152, 30, 50, 0.04)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "#981E32" }}
                        >
                          {job.title} at {job.company}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 2,
                            color: "#2a3033",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {job.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#5E6A71" }}>
                          Type: {job.type} | Applicants: {job.applicants.length}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 3 }}>
                        <Button
                          variant={hasApplied ? "outlined" : "contained"}
                          sx={{
                            backgroundColor: hasApplied
                              ? "transparent"
                              : "#981E32",
                            color: hasApplied ? "#981E32" : "#ffffff",
                            borderColor: "#981E32",
                            "&:hover": {
                              backgroundColor: hasApplied
                                ? "rgba(152, 30, 50, 0.04)"
                                : "#801929",
                              borderColor: "#801929",
                            },
                          }}
                          disabled={hasApplied}
                          onClick={() => handleApply(job._id)}
                        >
                          {hasApplied ? "Applied" : "Apply Now"}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Job;
