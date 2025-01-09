const config = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://somethinggoodeveryday.onrender.com"
      : "http://localhost:5001",
};

export default config;
