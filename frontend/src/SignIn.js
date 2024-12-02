import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInPage({ setAuthToken, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Failed to login");

      const data = await response.json();
      if (data.token) {
        setUserId(data.userId);
        // save token if returned
        setAuthToken(data.token);
        // When login is successful
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);
        navigate("/home");
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignInPage;
