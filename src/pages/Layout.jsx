
import React, { useState } from "react";
import LightSidebar from "../components/LightSidebar";
import { Outlet } from 'react-router-dom'
import TopNav from "../components/TopNav";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");  

  // Move logoImage state and handler here
  const [logoImage, setLogoImage] = useState(() => {
    const savedLogo = localStorage.getItem("dashspaceLogo");
    return savedLogo || null;
  });

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <LightSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        logoImage={logoImage}
        handleLogoUpload={handleLogoUpload}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative overflow-x-hidden">
        <div className="sticky top-0 z-50">
          <TopNav
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            logoImage={logoImage}
          />
        </div>
        <Outlet />
      </div>
    </section>
  )
}

export default Layout