import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import {
  Home as HomeIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(1),
    width: "100%",
  },
}));

interface SearchResult {
  _id: string;
  username: string;
  name: string;
}

interface User {
  _id: string;
  following: Array<{ _id: string }>;
}

interface HeaderProps {
  user: User | null;
}

function Header({ user }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchRef, setSearchRef] = useState<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`
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
        alert("Followed successfully!");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            <IconButton color="inherit" onClick={gotoHome}>
              <HomeIcon />
            </IconButton>
            <IconButton color="inherit" onClick={gotoNet}>
              <GroupIcon />
            </IconButton>
            <IconButton color="inherit" onClick={gotoNotif}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={gotoJob}>
              <WorkIcon />
            </IconButton>
            <IconButton color="inherit" onClick={gotoProfile}>
              <PersonIcon />
            </IconButton>
          </Box>
          <Box
            ref={setSearchRef}
            sx={{
              position: "relative",
              width: 400,
            }}
          >
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <StyledInputBase
                placeholder="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <IconButton sx={{ p: "10px" }}>
                <SearchIcon />
              </IconButton>
            </Paper>
            <Popover
              open={searchResults.length > 0}
              anchorEl={searchRef}
              onClose={() => setSearchResults([])}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                pointerEvents: "none",
                "& .MuiPopover-paper": {
                  pointerEvents: "auto",
                  width: 400,
                  mt: 1,
                },
              }}
              disableAutoFocus
              disableEnforceFocus
            >
              <Box
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                {searchResults.map((result) => (
                  <Box
                    key={result._id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&:not(:last-child)": {
                        borderBottom: "1px solid #eee",
                      },
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <Typography>
                      <strong>{result.username}</strong> ({result.name})
                    </Typography>
                    {result._id !== user?._id &&
                      !user?.following?.some((f) => f._id === result._id) && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleFollow(result._id)}
                          sx={{
                            backgroundColor: "#981E32",
                            "&:hover": {
                              backgroundColor: "#801929",
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "#5E6A71",
                            },
                          }}
                        >
                          Follow
                        </Button>
                      )}
                  </Box>
                ))}
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
