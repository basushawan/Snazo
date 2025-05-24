import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomBarChart = ({ data }) => {
  const barColor = (entry) => {
    switch (entry?.status) {
      case "Low":
        return "#00bc7d";
      case "Medium":
        return "#fe9900";
      case "High":
        return "#ff1f57";
      default:
        return "#00bc7d";
    }
  };
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const textColorClass =
      {
        Low: "text-green-600",
        Medium: "text-orange-600",
        High: "text-red-600",
      }[payload[0]?.payload?.status] || "text-gray-600";

    return (
      <div className="bg-white shadow-md border border-gray-300 rounded-lg p-2">
        <p className={`font-semibold text-xs ${textColorClass} mb-1`}>
          {payload[0]?.payload?.status}
        </p>
        <p className="text-sm text-gray-600">
          Count :
          <span className="text-xs text-gray-900 font-medium">
            {payload[0]?.payload?.count}
          </span>
        </p>
      </div>
    );
  };
  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 12, fill: "#555", fontWeight: "bold" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="count"
            nameKey="status"
            fill="#ff8042"
            radius={[10, 10, 0, 0]}
          >
            {Array.isArray(data) &&
              data.map((entry, i) => <Cell key={i} fill={barColor(entry)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
