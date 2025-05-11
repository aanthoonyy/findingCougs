/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface ModerationItem {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

function AdminModerate() {
  const [user, setUser] = useState<User | null>(null);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [moderationComment, setModerationComment] = useState("");

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

  const handleModerationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // TODO: Implement moderation submission
    console.log("Moderation comment:", moderationComment);
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
            {moderationItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.content}</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      /* TODO: Implement approve */
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      /* TODO: Implement reject */
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={handleModerationSubmit}>
          <div className="mb-3">
            <label htmlFor="moderationComment" className="form-label">
              Moderation Comment
            </label>
            <textarea
              className="form-control"
              id="moderationComment"
              rows={3}
              value={moderationComment}
              onChange={(e) => setModerationComment(e.target.value)}
              placeholder="Enter comments or actions..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Moderation
          </button>
        </form>

        <div className="mt-3">
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-secondary"
          >
            Back to Admin Tasks
          </button>
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
