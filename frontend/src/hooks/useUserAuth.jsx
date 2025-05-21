import React from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, loading, clearUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading) return;
    if (user) return;
    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};
