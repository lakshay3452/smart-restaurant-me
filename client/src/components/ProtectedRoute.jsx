import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAdmin = true; // Temporary allow access

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
