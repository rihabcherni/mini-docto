import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Chargement...</div>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
