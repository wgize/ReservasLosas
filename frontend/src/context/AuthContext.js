import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    if (token && raw) {
      setAuthToken(token);
      setUser(JSON.parse(raw));
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
