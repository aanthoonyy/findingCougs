import { useState, useEffect } from "react";

function AuthPage() {
  // Toggle between Login or Create Account mode
  const [isLogin, setIsLogin] = useState(true);

  // Fields for login (also used in create account)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional fields for create account
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  // For displaying all users
  const [users, setUsers] = useState([]);

  // Fetch all users on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to get all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Toggle the mode and clear form fields
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setUsername("");
  };

  // Handle the form submission (login or register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Decide which endpoint and body to use
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
        // For login, assume { success: true } on success
        if (result && result.success) {
          alert("Login successful!");
          // e.g. localStorage.setItem("token", result.token);
        } else {
          alert(result.error || "Invalid credentials");
        }
      } else {
        // For register, assume we get back a user object with _id
        if (result && result._id) {
          alert("Account created successfully!");
        } else {
          alert("Something went wrong creating account");
        }
      }

      // After a successful operation, re-fetch the user list
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Create Account fields */}
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </>
        )}

        {/* Common fields: email + password */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <hr />

      {/* Toggle Button */}
      <button onClick={handleToggleMode}>
        {isLogin
          ? "Don't have an account? Create one"
          : "Already have an account? Login"}
      </button>

      <hr />

      {/* Display All Users (Testing Only) */}
      <h2>All Registered Users (Testing Only)</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>Name:</strong> {user.name} &nbsp;|&nbsp;
            <strong>Username:</strong> {user.username} &nbsp;|&nbsp;
            <strong>Email:</strong> {user.email} &nbsp;|&nbsp;
            <strong>Password:</strong> {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuthPage;
