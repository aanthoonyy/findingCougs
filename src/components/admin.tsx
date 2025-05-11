/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../design/main.css';
import '../design/colors.css';
import '../design/shapes.css';
import '../design/alignment.css';
import '../design/text.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Admin() {
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
    <div className="primary">
      <div className="row back">
        {/* <!-- Remove unnecessary empty columns --> */}
        <div className="col-md-6 offset-md-3 border10 margin20 secondary text-center">
          <div className="heading">Admin Tasks</div>
          <div className="notif">
            <div className="circle1"></div>
            <a href="admin-jobs.html" className="linkDefault">Edit/Create Jobs</a>
          </div>

          <div className="notif">
            <div className="circle1"></div>
            <a href="admin-moderate.html" className="linkDefault">Moderate</a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Admin;
