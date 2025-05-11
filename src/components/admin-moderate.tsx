/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../design/main.css';
import '../design/colors.css';
import '../design/shapes.css';
import '../design/alignment.css';
import '../design/text.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminModerate() {
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
    <>
     <div className="container mt-5 primary">
      <h1 className="mb-4">Moderate Content</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Item ID</th>
            <th scope="col">Content</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Example content here...</td>
            <td>Pending</td>
            <td>
              <button className="btn btn-success btn-sm">Approve</button>
              <button className="btn btn-danger btn-sm">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
      <form>
        <div className="mb-3">
          <label htmlFor="moderationComment" className="form-label"
            >Moderation Comment</label>
          <textarea
            className="form-control"
            id="moderationComment"
            rows={3}
            placeholder="Enter comments or actions..."
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit Moderation</button>
      </form>

      <div className="mt-3">
        <a href="admin.html" className="btn btn-secondary">Back to Admin Tasks</a>
      </div>
    </div>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ENjdO4Dr2bkBIFxQpeo6OqQ2cUENn7Q91B5m2gP5p0iV1zI1z8r4z8nQfZ+X9ZyX"
      crossOrigin="anonymous"
    ></script>
    </>
  );
}

export default AdminModerate;
