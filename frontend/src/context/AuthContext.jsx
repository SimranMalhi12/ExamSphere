import { createContext, useContext, useState, useEffect } from "react";

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

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        isAuthenticated: !!token,
        isAdmin: role === "ADMIN",
        isStudent: role === "STUDENT",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);