import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./logIn.css";
import config from "./config";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      navigate("/signIn");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signin-container">
      <h1>Register</h1>
      <form className="signin-form" onSubmit={handleRegister}>
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
        <button className="submit-button" type="submit">
          Register
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p>Already have an account?</p>
      <button className="sign-in-button" onClick={() => navigate("/signIn")}>
        Sign In
      </button>
    </div>
  );
}

export default RegisterPage;
