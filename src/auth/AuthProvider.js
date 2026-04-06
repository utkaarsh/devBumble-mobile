import React, { useState, useEffect } from "react";
import AuthContext from "./context";
import { getToken, deleteToken } from "./authTokenStorage";
import axios from "axios";
import { path } from "../utils/path";
import { ActivityIndicator } from "react-native";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await getToken();
      console.log("Restoring session with token:", token);

      if (!token) return;

      const res = await axios.get(`${path}/profile/view`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.log("Catch Error :: ", error.response?.data || error.message);
      console.log("Token deleted called");
      await deleteToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
