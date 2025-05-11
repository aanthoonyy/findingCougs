/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../design/main.css";
import "../design/colors.css";
import "../design/shapes.css";
import "../design/alignment.css";
import "../design/text.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  following: Array<{ _id: string }>;
}

interface SearchResult {
  _id: string;
  name: string;
  username: string;
}

function GroupPeople() {
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    if (state.community?.members) {
      fetchMemberDetails();
    }
  }, [navigate, state.community]);

  const fetchMemberDetails = async () => {
    if (!state.community?.members) return;

    try {
      const memberPromises = state.community.members.map((memberId: string) =>
        fetch(`http://localhost:5000/users/${memberId}`).then((res) =>
          res.json()
        )
      );
      const members = await Promise.all(memberPromises);
      setMemberDetails(members);
    } catch (err) {
      console.error("Error fetching member details:", err);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching users:", err);
      alert("Failed to search users");
    }
  };

  const handleFollow = async (targetId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/follow/${targetId}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.success) {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error following user:", err);
      alert("Failed to follow user");
    }
  };

  const gotoHome = () => navigate("/homepage");
  const gotoNet = () => navigate("/network");
  const gotoNotif = () => navigate("/notification");
  const gotoJob = () => navigate("/jobs");
  const gotoProfile = () => navigate("/profile");

  const gotoPosts = async (communityId: string) => {
    if (!user) return;
    try {
      const response = await fetch("http://localhost:5000/network/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, communityId: communityId }),
      });
      const data = await response.json();
      if (data.success) {
        navigate(`/network/group`, { state: { community: data.community } });
      } else {
        alert(data.error || "Failed to get community");
      }
    } catch (err) {
      console.error("Error finding community:", err);
      alert("Failed to find community");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="primary">
      <form onSubmit={handleSearch} className="padding10 rightAlign">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="margin10 bodyText"
        />
        <button type="submit" className="buttonText">
          Search
        </button>
      </form>
      <div className="leftAlign">
        {searchResults.map((result) => (
          <div
            key={result._id}
            className="bodyText secondary margin10 padding10"
          >
            {result._id !== user._id &&
              !user.following?.some((f) => f._id === result._id) && (
                <button
                  onClick={() => handleFollow(result._id)}
                  className="buttonText marginLeft10"
                >
                  Follow
                </button>
              )}
            <strong>{result.username}</strong> ({result.name})
          </div>
        ))}
      </div>
      <div className="row navbar">
        <div className="col d-flex rightAlign">
          <div className="navbarContent text bodyText">
            <a onClick={gotoHome} className="navbarConentLink text">
              Home
            </a>
          </div>
          <div className="navbarContent text bodyText">
            <a onClick={gotoNet} className="navbarConentLink text">
              Groups
            </a>
          </div>
          <div className="navbarContent text bodyText">
            <a onClick={gotoNotif} className="navbarConentLink text">
              Notifications
            </a>
          </div>
          <div className="navbarContent text bodyText">
            <a onClick={gotoJob} className="navbarConentLink text">
              Jobs
            </a>
          </div>
          <div className="navbarContent text bodyText">
            <a onClick={gotoProfile} className="navbarConentLink text">
              My Profile
            </a>
          </div>
        </div>
      </div>
      <div className="row paddingTop20 center">
        <div className="col border10 margin20 secondary text-center">
          <div className="name margin10">{state.community.name}</div>
          <div className="row center marginTop10 marginBottom10 grey">
            <div className="col d-flex center">
              <a
                onClick={() => gotoPosts(state.community._id)}
                className="text bodyText marginLeft10 marginRight10 center"
              >
                Posts
              </a>
              <a className="text bodyText marginLeft10 marginRight10 center active">
                People
              </a>
            </div>
          </div>
          <div className="row center marginTop10 marginBottom10">
            <h3>Members</h3>
            <div className="members-list">
              {memberDetails.map((member) => (
                <div key={member._id} className="grey margin10 padding10">
                  <div className="bodyText">
                    <strong>{member.name}</strong>
                    <br />
                    Username: {member.username}
                    <br />
                    Email: {member.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPeople;
