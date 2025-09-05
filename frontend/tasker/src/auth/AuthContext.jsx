import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";
const Ctx = createContext({
  user: null,
  ready: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  // adopt bearer support in case cookies are blocked; server primarily uses cookies
  const setAuthHeader = (token) => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  };
  const fetchMe = async () => {
    const { data } = await api.get("/users/me");
    setUser(data);
  };
  useEffect(() => {
    (async () => {
      try {
        await fetchMe();
      } catch {
        try {
          const { data } = await api.post("/auth/refresh");
          setAuthHeader(data?.accessToken);
          await fetchMe();
        } catch {
          setUser(null);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAuthHeader(data?.accessToken);
    await fetchMe();
  };
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setAuthHeader(data?.accessToken);
    await fetchMe();
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setAuthHeader(null);
      setUser(null);
    }
  };
  return (
    <Ctx.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}
