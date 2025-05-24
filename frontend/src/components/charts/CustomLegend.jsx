import React from "react";

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
      {payload.map((entry, i) => (
        <div className="flex items-center space-x-2" key={`legend-${i}`}>
          <div
            className="rounded-full w-2.5 h-2.5"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700 font-medium">
            {entry?.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
