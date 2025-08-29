import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const LightStatsCard = ({ icon: Icon, title, value, change, trend, iconColor = "blue" }) => {
  // Icon color configurations
  const iconColors = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500", 
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  // Change background colors
  const changeColors = {
    up: "bg-green-100 text-green-600",
    down: "bg-red-100 text-red-600",
    neutral: "bg-gray-100 text-gray-600"
  };

  return (
    <div className="bg-white border border-gray-100 min-w-0 flex-1 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:border-gray-200 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0"> {/* min-w-0 allows text to shrink */}
          <p className="text-sm text-gray-500 font-medium mb-2 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 break-words">
            {value}
          </p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColors[trend] || changeColors.neutral}`}>
              {trend === "up" && <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />}
              {trend === "down" && <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />}
              <span className="whitespace-nowrap">
                {change.num} {change.text}
              </span>
            </div>
          )}
        </div>
        <div className={`ml-3 p-3 ${iconColors[iconColor]} rounded-full flex-shrink-0`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default LightStatsCard;