import React from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Model from "../Model";
import AvatarGroups from "../AvatarGroups";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = React.useState([]);
  const [tempSelectedUsers, setTempSelectedUsers] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching all users: ", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };
  const selectedUsersAvatar = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  React.useEffect(() => {
    getAllUsers();
  }, []);
  React.useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
    return () => {};
  }, [selectedUsers]);
  return (
    <div className="mt-2 space-y-4">
      {selectedUsersAvatar.length === 0 && (
        <button
          className="card-btn"
          style={{ padding: "0.8rem 1rem" }}
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-xs" /> Add Members
        </button>
      )}

      {selectedUsersAvatar.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroups avatars={selectedUsersAvatar} maxVisible={3} />
        </div>
      )}
      <Model
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="overflow-y-auto space-y-4 h-[60vh]">
          {allUsers.map((user) => (
            <div
              className="flex items-center gap-4 p-3 border-b border-gray-200"
              key={user._id}
            >
              <img
                src={user?.profileImageUrl || null}
                alt={user?.name}
                className="rounded-full size-10"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-[13px] text-gray-500">{user?.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user?._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="text-primary bg-gray-100 border-gray-300 rounded-sm outline-none w-4 h-4"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            Done
          </button>
        </div>
      </Model>
    </div>
  );
};

export default SelectUsers;
