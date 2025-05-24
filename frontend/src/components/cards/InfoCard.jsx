import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color} rounded-full w-2 h-3 md:w-3 md:h-5`} />
      <p className="text-xs text-gray-500 md:text-[14px] flex items-center justify-center text-center">
        <span className="text-sm md:text-[15px] text-black font-semibold px-1">
          {value}
        </span>
        {label}
      </p>
    </div>
  );
};

export default InfoCard;
