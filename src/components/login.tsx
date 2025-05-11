import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import "../design/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  error?: string;
}

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setUsername("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";

      const body = isLogin
        ? { email, password }
        : { name, username, email, password };

      let result = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();

      if (isLogin) {
        if (result && result.success) {
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate("/homepage");
        } else {
          alert(result.error || "Invalid credentials");
        }
      } else {
        if (result && result.success) {
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate("/homepage");
        } else {
          alert(result.error || "Something went wrong creating account");
        }
      }

      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ color: "#981E32", fontWeight: "bold" }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mt: 2 }}>
                {!isLogin && (
                  <>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                  </>
                )}

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#981E32",
                    "&:hover": {
                      bgcolor: "#801929",
                    },
                  }}
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 2 }} />

            <Button
              onClick={handleToggleMode}
              fullWidth
              variant="text"
              sx={{
                color: "#5E6A71",
                "&:hover": {
                  bgcolor: "rgba(94, 106, 113, 0.04)",
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </Button>
          </CardContent>
        </Card>

        {/* Testing section - Collapsed and styled */}
        <Paper
          sx={{
            mt: 4,
            p: 2,
            display: process.env.NODE_ENV === "development" ? "block" : "none",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#5E6A71" }}>
            Registered Users (Development Only)
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: "auto" }}>
            {users.map((user) => (
              <Box
                key={user._id}
                sx={{
                  p: 1,
                  borderBottom: "1px solid #eee",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography variant="body2">
                  <strong>Name:</strong> {user.name} &nbsp;|&nbsp;
                  <strong>Username:</strong> {user.username} &nbsp;|&nbsp;
                  <strong>Email:</strong> {user.email} &nbsp;|&nbsp;
                  <strong>Password:</strong> {user.password}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
