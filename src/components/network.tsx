/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import CommunityList from "./CommunityList";
import CommunityDetails from "./CommunityDetails";

interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  following: Array<{ _id: string }>;
}

interface Post {
  text: string;
  createdAt: string;
}

interface UserWithPosts extends User {
  posts?: Post[];
}

function Network() {
  const [user, setUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const [feed, setFeed] = useState<UserWithPosts[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchCommunities();
  }, [navigate]);

  useEffect(() => {
    if (selectedCommunity) {
      fetchMemberDetails();
      fetchFeed();
    }
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    try {
      const response = await fetch("http://localhost:5000/network");
      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      console.error("Error fetching communities:", err);
    }
  };

  const handleJoin = async (communityId: string) => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:5000/network/${communityId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Joined community successfully!");
        fetchCommunities();
      } else {
        alert(data.error || "Failed to join community");
      }
    } catch (err) {
      console.error("Error joining community:", err);
      alert("Failed to join community");
    }
  };

  const handleLeave = async (communityId: string) => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:5000/network/${communityId}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Left community successfully!");
        fetchCommunities();
        if (selectedCommunity?._id === communityId) {
          setSelectedCommunity(null);
        }
      } else {
        alert(data.error || "Failed to leave community");
      }
    } catch (err) {
      console.error("Error leaving community:", err);
      alert("Failed to leave community");
    }
  };

  const fetchMemberDetails = async () => {
    if (!selectedCommunity?.members) return;

    try {
      const memberPromises = selectedCommunity.members.map((memberId: string) =>
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

  const fetchFeed = async () => {
    if (!user || !selectedCommunity) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/feed`
      );
      const data = await response.json();
      // Filter posts to only show from group members
      const groupMemberPosts = data.filter((u: { _id: string }) =>
        selectedCommunity.members.some(
          (memberId: string) => memberId.toString() === u._id.toString()
        )
      );
      setFeed(groupMemberPosts);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header user={user} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {selectedCommunity ? (
          <CommunityDetails
            community={selectedCommunity}
            feed={feed}
            memberDetails={memberDetails}
            onBack={() => setSelectedCommunity(null)}
          />
        ) : (
          <CommunityList
            communities={communities}
            user={user}
            onSelectCommunity={setSelectedCommunity}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        )}
      </Container>
    </Box>
  );
}

export default Network;
