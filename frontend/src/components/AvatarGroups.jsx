import React from "react";

const AvatarGroups = ({ avatars, maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, i) => (
        <img
          key={i}
          src={avatar}
          alt={`Avatar ${i}`}
          className="h-9 w-9 border-2 -ml-3 border-white rounded-full first:ml-0"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="flex size-9 items-center justify-center">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroups;
