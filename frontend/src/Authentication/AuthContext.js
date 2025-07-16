import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // in seconds
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (token && !isTokenValid(token)) {
      logout();
    }
  }, [token]);

  const isLoggedIn = useMemo(() => !!token && isTokenValid(token), [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  console.log(isTokenValid(token));
  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
