import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (!active && !payload && payload.length === 0) return null;
  return (
    <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
      <p className="text-xs font-semibold mb-1 text-purple-800">
        {payload[0]?.name}
      </p>
      <p className="text-gray-600 text-sm">
        Count:{" "}
        <span className="text-gray-900 font-medium text-xs">
          {payload[0]?.value}
        </span>
      </p>
    </div>
  );
};

export default CustomTooltip;
