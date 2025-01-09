import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./logIn.css";
import config from "./config";

function SignInPage({ setAuthToken, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to login. Please check your credentials."
        );
      }

      if (data.token) {
        setUserId(data.userId);
        setAuthToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);
        navigate("/home");
      } else {
        throw new Error("Authentication failed - no token received");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signin-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="signin-form">
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Sign In
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>No account?</p>
      <button className="register-button" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}

export default SignInPage;
