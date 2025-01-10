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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message;
        } catch (e) {
          errorMessage = errorText || "Registration failed. Please try again.";
        }

        throw new Error(errorMessage);
      }
      const data = await response.json();
      navigate("/signIn");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
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
