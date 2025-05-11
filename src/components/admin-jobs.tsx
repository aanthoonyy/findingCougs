/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../design/main.css';
import '../design/colors.css';
import '../design/shapes.css';
import '../design/alignment.css';
import '../design/text.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminJobs() {
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [feed, setFeed] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    fetchFullUser(parsedUser._id);
  }, [navigate]);

  const fetchFullUser = async (userId: any) => {
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <><div className="container mt-5 primary">
          <h1 className="mb-4">Edit/Create Jobs</h1>
          <form>
              <div className="mb-3">
                  <label htmlFor="jobTitle" className="form-label">Job Title</label>
                  <input
                      type="text"
                      className="form-control"
                      id="jobTitle"
                      placeholder="Enter job title" />
              </div>
              <div className="mb-3">
                  <label htmlFor="jobDescription" className="form-label">Job Description</label>
                  <textarea
                      className="form-control"
                      id="jobDescription"
                      rows={4}
                      placeholder="Enter job description"
                  ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save Job</button>
          </form>
          <div className="mt-3">
              <a href="admin.html" className="btn btn-secondary">Back to Admin Tasks</a>
          </div>
      </div><script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeo6OqQ2cUENn7Q91B5m2gP5p0iV1zI1z8r4z8nQfZ+X9ZyX"
          crossOrigin="anonymous"
      ></script></>
  );
}

export default AdminJobs;
