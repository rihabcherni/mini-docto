import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Chargement...</div>;  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
