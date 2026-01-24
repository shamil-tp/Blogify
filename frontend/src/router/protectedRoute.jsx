import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { loading, authenticated } = useAuth();

  if (loading) return null;

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
