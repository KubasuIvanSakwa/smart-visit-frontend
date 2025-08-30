import React from "react";
import { Search, Cog as Settings, Bell } from "lucide-react";
import { Link } from "react-router";

export default function TopNav() {
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0 right-0 border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150 z-40 px-2 sm:px-6 py-6 h-[5rem]">
        <div className="flex items-center justify-center h-[3.8rem] bg-transparent">
          <div className="flex items-center justify-between z-10 p-2 h-full w-[100%] overflow-hidden rounded-md shadow-sm bg-white">
            
            {/* Search */}
            <div className="flex items-center flex-1 min-w-0 mr-1 sm:mr-2">
              <Search className="h-4 w-4 text-gray-500 ml-1 sm:ml-3 opacity-50" />
              <input
                className="outline-none px-1 sm:px-2 text-sm placeholder:text-gray-400"
                placeholder="Search..."
              />
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5 text-gray-600 mr-1 sm:mr-4 flex-shrink-0">
              {/* Settings */}
              <Link to="profile">
                <Settings className="cursor-pointer" />
              </Link>
              {/* Notifications */}
              <Link to="notifications">
                <div className="relative cursor-pointer">
                  <Bell className="" />
                  {/* Red Dot */}
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  {/* Ping effect */}
                  <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                </div>
              </Link>

              {/* Profile avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden border border-blue-800 cursor-pointer right-[2rem] p-1">
                <div className="bg-yellow-700 w-full h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}