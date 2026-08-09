import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();
  const token = localStorage.getItem("token") || "";
  const currentRole = localStorage.getItem("role") || role;

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentRole && currentRole !== allowedRole) {
    if (currentRole === "SUPER_ADMIN") {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (currentRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;