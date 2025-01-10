const config = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://somethinggoodeveryday-backend.onrender.com"
      : "http://localhost:5001",
};

export default config;
