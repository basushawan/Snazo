import React from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";

const SideMenu = ({ activeMenu }) => {
  const [sideMenuData, setSideMenuData] = React.useState([]);
  const { user, clearUser } = React.useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };
  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error?.response?.data || error.message);
    } finally {
      localStorage.clear();
      clearUser();
      navigate("/login");
    }
  };

  React.useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);
  return (
    <div className="w-64 h-[calc(100vh-61px)] border-r bg-white border-gray-200/50 sticky top-[61px] z-20">
      <div className="mb-7 pt-5 flex flex-col items-center justify-center">
        <div className="relative">
          <img
            src={user?.profileImageUrl || null}
            alt="Profile Image"
            className="bg-slate-400 rounded-full w-20 h-20"
          />
        </div>
        {user?.role == "admin" && (
          <div className="text-[10px] bg-primary font-medium text-white px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}
        <h5 className="text-gray-950 font-medium mt-3 leading-6">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-400">{user?.email || ""}</p>
      </div>
      {sideMenuData.map((item, i) => (
        <button
          key={`menu_${i}`}
          onClick={() => handleClick(item.path)}
          className={`w-full text-[15px] flex items-center gap-4 py-3 px-6 mb-3 cursor-pointer ${
            activeMenu == item.label
              ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
              : ""
          }`}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
