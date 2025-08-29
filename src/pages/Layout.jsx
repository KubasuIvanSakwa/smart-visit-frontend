import React, { useState } from "react";
// import { useNotification } from "../components/NotificationProvider";
import LightSidebar from "../components/LightSidebar";
import { Outlet } from 'react-router-dom'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");  

  
  return (
    <section className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <LightSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </section>
  )
}

export default Layout