import React from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (user) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
