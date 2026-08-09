import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const token = localStorage.getItem("token") || "";
  const currentRole = localStorage.getItem("role") || role;

  if (!token && !isAuthenticated) {
    if (allowedRole === "ADMIN" || allowedRole === "SUPER_ADMIN") {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  const validRoles = allowedRoles || (allowedRole ? [allowedRole] : []);

  if (validRoles.length > 0) {
    const hasRole = validRoles.includes(currentRole) || 
      (validRoles.includes("ADMIN") && currentRole === "SUPER_ADMIN");

    if (!hasRole) {
      if (currentRole === "SUPER_ADMIN") {
        return <Navigate to="/super-admin/dashboard" replace />;
      }
      if (currentRole === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;