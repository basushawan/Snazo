import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";

const UserDashboard = () => {
  useUserAuth();
  const { user } = React.useContext(UserContext);
  return (
    <div>
      UserDashboard
      {JSON.stringify(user)}
    </div>
  );
};

export default UserDashboard;
