import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logIn.css";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard"); // Redirect to a dashboard or homepage
    }
  }, [navigate]);

  return (
    <div
      className="signin-container"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <h1>Welcome to Something Good Everyday</h1>
      <p>Please register or log in to continue.</p>
      <button
        className="register-button"
        onClick={() => navigate("/register")}
        style={{ margin: "10px" }}
      >
        Register
      </button>
      <button
        className="sign-in-button"
        onClick={() => navigate("/signIn")}
        style={{ margin: "10px" }}
      >
        Log In
      </button>
    </div>
  );
}

export default LandingPage;
