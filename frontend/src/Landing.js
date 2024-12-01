import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard"); // Redirect to a dashboard or homepage
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Website</h1>
      <p>Please register or log in to continue.</p>
      <button onClick={() => navigate("/register")} style={{ margin: "10px" }}>
        Register
      </button>
      <button onClick={() => navigate("/signIn")} style={{ margin: "10px" }}>
        Log In
      </button>
    </div>
  );
}

export default LandingPage;
