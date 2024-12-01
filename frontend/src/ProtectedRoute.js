import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // go to login page if not authenticated
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
