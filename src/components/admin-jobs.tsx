/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

function AdminJobs() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs] = useState<Job[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser) as User;
    fetchFullUser(parsedUser._id);
  }, [navigate]);

  const fetchFullUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        navigate("/login");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      navigate("/login");
    }
  };

  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // TODO: Implement job creation/update
      console.log("Creating job:", {
        title: jobTitle,
        description: jobDescription,
      });
      setJobTitle("");
      setJobDescription("");
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mt-5 primary">
        <h1 className="mb-4">Edit/Create Jobs</h1>
        <form onSubmit={handleJobSubmit}>
          <div className="mb-3">
            <label htmlFor="jobTitle" className="form-label">
              Job Title
            </label>
            <input
              type="text"
              className="form-control"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="jobDescription" className="form-label">
              Job Description
            </label>
            <textarea
              className="form-control"
              id="jobDescription"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Job
          </button>
        </form>

        <div className="mt-4">
          <h2>Existing Jobs</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>{job.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          /* TODO: Implement edit */
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          /* TODO: Implement delete */
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3">
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-secondary"
          >
            Back to Admin Tasks
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminJobs;
