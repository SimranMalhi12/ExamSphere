import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (tokenValue, roleValue, userObj = {}) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("role", roleValue);
    localStorage.setItem("user", JSON.stringify(userObj));
    if (userObj.id) {
      localStorage.setItem("userId", userObj.id);
    }
    setToken(tokenValue);
    setRole(roleValue);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const permissions = {
    canCreateExams: user?.canCreateExams !== false,
    canManageQuestions: user?.canManageQuestions !== false,
    canManageSubjects: user?.canManageSubjects !== false,
    canViewSubmissions: user?.canViewSubmissions !== false,
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        permissions,
        isAuthenticated: !!token,
        isSuperAdmin: role === "SUPER_ADMIN",
        isAdmin: role === "ADMIN",
        isStudent: role === "STUDENT" || role === "USER",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);