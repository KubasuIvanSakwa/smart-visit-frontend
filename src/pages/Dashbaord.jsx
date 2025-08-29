import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router';
import { useNotification } from '../components/NotificationProvider';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LightSidebar from '../components/LightSidebar';


// Sample data
// const currentVisitors = [
//   { id: 1, name: 'John Doe', company: 'ABC Corp', host: 'Sarah Wilson', checkIn: '09:30 AM', status: 'In Office', type: 'Pre-registered' },
//   { id: 2, name: 'Jane Smith', company: 'XYZ Ltd', host: 'Mike Johnson', checkIn: '10:15 AM', status: 'In Meeting', type: 'Walk-in' },
//   { id: 3, name: 'Bob Chen', company: 'Tech Solutions', host: 'Lisa Brown', checkIn: '11:00 AM', status: 'In Office', type: 'Pre-registered' },
// ];

// const pendingApprovals = [
//   { id: 8, name: 'Peter Parker', company: 'Daily Bugle', host: 'J. Jonah Jameson', appointmentTime: '03:00 PM' },
//   { id: 9, name: 'Clark Kent', company: 'Daily Planet', host: 'Lois Lane', appointmentTime: '04:00 PM' },
// ];

const Dashbaord = () => {
  const [activeTheme, setActiveTheme] = useState("light");
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const initialLoad = useRef(false);

  // const handleApproveVisitor = (visitorId) => {
  //   const visitor = pendingList.find(v => v.id === visitorId);
  //   if (visitor) {
  //     setPendingList(pendingList.filter(v => v.id !== visitorId));
  //     setVisitorList([...visitorList, {
  //       ...visitor,
  //       checkIn: 'Pending Arrival',
  //       status: 'Approved',
  //       type: 'Approved'
  //     }]);
  //   }
  // };

  // const handleRejectVisitor = (visitorId) => {
  //   setPendingList(pendingList.filter(v => v.id !== visitorId));
  // };

  

  const LightStatsCard = ({ icon: Icon, title, value, change, trend }) => (
    <div className="bg-white border border-gray-100 p-6 transition-all duration-200 hover:border-gray-200 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-light text-gray-900 mb-1">{value}</p>
          {change && (
            <p
              className={`text-xs flex items-center ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-400"
              }`}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className="ml-4 p-2 bg-gray-50 rounded-lg">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const LightVisitorTable = ({ title, data }) => (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {data.map((visitor) => (
          <div
            onClick={() =>
              (window.location.href = `dashboard/visitor/${visitor.id}`)
            }
            key={visitor.id}
            className="px-6 cursor-pointer hover:bg-gray-200 py-4 hover:bg-gray-25 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{`${visitor.first_name} ${visitor.last_name}`}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {visitor.company}
                </div>
                <div className="text-xs text-gray-400">{visitor.purpose}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    visitor.status === "In Meeting"
                      ? "bg-blue-100 text-blue-800"
                      : visitor.status === "checked_in"
                      ? "bg-green-100 text-green-800"
                      : visitor.status === "checked_ut"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {visitor.status}
                </div>
                <div className="text-xs text-gray-400">{visitor.checkIn}</div>
                <ChevronRight className="h-3 w-3 text-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  const DarkStatsCard = ({ icon: Icon, title, value, change, trend }) => (
    <div className="bg-gray-900 border border-gray-800 p-6 transition-all duration-200 hover:border-gray-700 hover:bg-gray-850">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
          <p className="text-2xl font-light text-white mb-1">{value}</p>
          {change && (
            <p
              className={`text-xs flex items-center ${
                trend === "up"
                  ? "text-green-400"
                  : trend === "down"
                  ? "text-red-400"
                  : "text-gray-500"
              }`}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className="ml-4 p-2 bg-gray-800 rounded-lg">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );

  const DarkTable = ({ title, data, showHost = true }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-100 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-800">
        {data.map((item, index) => (
          <div
            key={index}
            className="px-6 py-4 hover:bg-gray-800 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100 mb-1">
                  {item.name}
                </div>
                <div className="text-xs text-gray-400">{item.company}</div>
              </div>
              {showHost && (
                <div className="text-xs text-gray-500 mr-4">{item.host}</div>
              )}
              <div className="text-xs text-gray-500">
                {item.checkIn || item.appointmentTime}
              </div>
              <ChevronRight className="h-3 w-3 text-gray-600 ml-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      addNotification("Loading..", "info");

      const [statsRes, visitorsRes, approvalsRes, hoursRes, trendsRes] =
        await Promise.all([
          api.get("/api/dashboard/stats/").catch((err) => {
            addNotification("Could not load statistics", "warning");
            return { data: null };
          }),
          api.get("/api/dashboard/current-visitors/").catch((err) => {
            addNotification("Could not load current visitors", "warning");
            return { data: [] };
          }),
          api.get("/api/dashboard/pending-approvals/").catch((err) => {
            addNotification("Could not load pending approvals", "warning");
            return { data: [] };
          }),
          api.get("/api/dashboard/peak-hours/").catch((err) => {
            addNotification("Could not load peak hours data", "warning");
            return { data: [] };
          }),
          api.get("/api/dashboard/monthly-trends/").catch((err) => {
            addNotification("Could not load monthly trends", "warning");
            return { data: [] };
          }),
        ]);

      // Set data only if response exists
      if (statsRes.data) setStats(statsRes.data);
      if (visitorsRes.data) setVisitors(visitorsRes.data);
      console.log(visitorsRes.data);
      if (approvalsRes.data) setPendingApprovals(approvalsRes.data);
      if (hoursRes.data) setPeakHours(hoursRes.data);
      if (trendsRes.data) setMonthlyTrends(trendsRes.data);

      setLastUpdated(new Date());
      addNotification("Dashboard updated successfully", "success");
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      addNotification("Failed to load dashboard data", "error");

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        addNotification("Session expired - redirecting to login", "error");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState("admin");

  //   useEffect(() => {
  //   if (!initialLoad.current) {
  //     initialLoad.current = true;
  //     fetchData();
  //   }

  //   // // Set up polling every 30 seconds
  //   // const interval = setInterval(fetchData, 30000);
  //   // return () => clearInterval(interval);
  // }, []);

  const handleCheckOut = async (visitorId) => {
    try {
      await api.post(`/api/visitors/${visitorId}/checkout`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to check out visitor:", err);
      setError("Failed to check out visitor. Please try again.");
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.post(`/api/visitors/approve/${requestId}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to approve request:", err);
      setError("Failed to approve request. Please try again.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.post(`/api/visitors/reject/${requestId}`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to reject request:", err);
      setError("Failed to reject request. Please try again.");
    }
  };

  const getVisibleVisitors = () => {
    if (currentRole === "host") {
      return visitors.filter((v) => v.host === user?.name);
    }
    return visitors;
  };

  const getVisiblePendingApprovals = () => {
    if (currentRole === "host") {
      return pendingApprovals.filter((v) => v.host === user?.name);
    }
    return pendingApprovals;
  };

  const visibleVisitors = getVisibleVisitors();
  localStorage.setItem("visibleVisitors", JSON.stringify(visibleVisitors));
  // console.log(`${visibleVisitors[0]?.first_name} ${visibleVisitors[0]?.last_name}`)
  console.log(`${visibleVisitors}`);
  const visiblePendingApprovals = getVisiblePendingApprovals();

  const formatDuration = (duration) => {
    if (!duration) return "0sec";

    // Handle Django format: HH:MM:SS.microseconds
    if (typeof duration === "string") {
      const [timePart] = duration.split(".");
      const parts = timePart.split(":").map(Number); // Convert to numbers

      if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;

        let result = "";
        if (hours > 0) result += `${hours}hr `;
        if (minutes > 0) result += `${minutes}min `;
        if (seconds > 0 || result === "") result += `${seconds}sec`;

        return result.trim();
      }

      return timePart;
    }

    return "0sec";
  };

  const formatCheckinTime = (datetimeString) => {
    if (!datetimeString) return "";

    const date = new Date(datetimeString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // convert 0 to 12
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const statsData = [
    {
      icon: Users,
      title: "Today's Visitors",
      value: visibleVisitors
        .filter((v) => v.status !== "Checked Out")
        .length.toString(),
      change: "+8% from yesterday",
      trend: "up",
    },
    {
      icon: UserCheck,
      title: "Total This Month",
      value: visibleVisitors
        .filter((v) => v.status !== "Checked Out")
        .length.toString(),
      change: "+15% from last month",
      trend: "up",
    },
    {
      icon: AlertCircle,
      title: "Currently Pending",
      value: visiblePendingApprovals
        .filter((v) => v.status !== "Checked Out")
        .length.toString(),
      change: "Awaiting approval",
    },
    {
      icon: Clock,
      title: "Avg Visit Duration",
      value: "6h",
      change: "-12% from last week",
      trend: "down",
    },
    {
      icon: TrendingUp,
      title: "Monthly Growth",
      value: "+13%",
      change: "vs last month",
      trend: "up",
    },
    {
      icon: UserPlus,
      title: "New Registrations",
      value: "0",
      change: "This week",
    },
  ];

  
  // Import the new LightSidebar component
  // const LightSidebar = ({
  //   sidebarOpen,
  //   setSidebarOpen,
  //   activeNav,
  //   setActiveNav,
  //   handleLogout,
  //   navItems,
  // }) => {
  //   // Initialize state from localStorage or default to true
  //   const [isExpanded, setIsExpanded] = useState(() => {
  //     const saved = localStorage.getItem("sidebarExpanded");
  //     return saved !== null ? JSON.parse(saved) : true;
  //   });

  //   const [logoImage, setLogoImage] = useState(() => {
  //     // Also save logo in localStorage
  //     const savedLogo = localStorage.getItem("dashspaceLogo");
  //     return savedLogo || null;
  //   });

  //   // Save to localStorage whenever isExpanded changes
  //   useEffect(() => {
  //     localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
  //   }, [isExpanded]);

  //   // Save logo to localStorage whenever it changes
  //   useEffect(() => {
  //     if (logoImage) {
  //       localStorage.setItem("dashspaceLogo", logoImage);
  //     } else {
  //       localStorage.removeItem("dashspaceLogo");
  //     }
  //   }, [logoImage]);

  //   const handleLogoUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => setLogoImage(e.target.result);
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleToggleExpanded = () => {
  //     setIsExpanded((prevExpanded) => !prevExpanded);
  //   };

  //   return (
  //     <div
  //       className={`fixed inset-y-0 left-0 z-50 ${
  //         isExpanded ? "w-64" : "w-16"
  //       } bg-white border-r border-gray-200 transform ${
  //         sidebarOpen ? "translate-x-0" : "-translate-x-full"
  //       } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
  //     >
  //       {/* Header */}
  //       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
  //         <div className="flex items-center space-x-3">
  //           {/* Logo */}
  //           <div className="relative">
  //             <input
  //               type="file"
  //               accept="image/*"
  //               onChange={handleLogoUpload}
  //               className="hidden"
  //               id="logo-upload"
  //             />
  //             <label
  //               htmlFor="logo-upload"
  //               className="block w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded cursor-pointer hover:opacity-80 transition-opacity"
  //               title="Click to upload logo"
  //             >
  //               {logoImage ? (
  //                 <img
  //                   src={logoImage}
  //                   alt="Logo"
  //                   className="w-8 h-8 rounded object-cover"
  //                 />
  //               ) : (
  //                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
  //                   DS
  //                 </div>
  //               )}
  //             </label>
  //           </div>

  //           {/* DashSpace Text */}
  //           {isExpanded && (
  //             <h2 className="text-lg font-semibold text-gray-900 transition-opacity duration-200">
  //               DashSpace
  //             </h2>
  //           )}
  //         </div>

  //         {/* Toggle Button */}
  //         <button
  //           onClick={handleToggleExpanded}
  //           className="p-1 rounded-full hover:bg-gray-100 transition-colors"
  //           title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
  //         >
  //           <div className="w-4 h-4 border-2 border-gray-400 rounded-full relative">
  //             <div
  //               className={`absolute top-0.5 left-0.5 w-2 h-2 bg-gray-400 rounded-full transition-transform duration-200 ${
  //                 isExpanded
  //                   ? "transform translate-x-0"
  //                   : "transform translate-x-1"
  //               }`}
  //             ></div>
  //           </div>
  //         </button>

  //         {/* Close button for mobile */}
  //         <button
  //           onClick={() => setSidebarOpen(false)}
  //           className="lg:hidden p-1 rounded hover:bg-gray-100"
  //         >
  //           <X className="h-5 w-5 text-gray-500" />
  //         </button>
  //       </div>

  //       <nav className="px-3 pt-4">
  //         {/* MENU Section */}
  //         {isExpanded && (
  //           <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3">
  //             MENU
  //           </div>
  //         )}

  //         {/* Dashboard */}
  //         <Link
  //           to="/dashboard"
  //           onClick={() => setActiveNav("dashboard")}
  //           className={`flex items-center ${
  //             isExpanded ? "px-3 justify-start" : "px-2 justify-center"
  //           } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors group ${
  //             activeNav === "dashboard"
  //               ? "bg-gray-100 text-gray-900"
  //               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  //           }`}
  //           title={!isExpanded ? "Dashboard" : ""}
  //         >
  //           <Home className="h-5 w-5 flex-shrink-0" />
  //           {isExpanded && <span className="ml-3">Dashboard</span>}
  //           {isExpanded && (
  //             <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
  //           )}
  //         </Link>

  //         {/* APPS Section */}
  //         {isExpanded && (
  //           <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-6 px-3">
  //             APPS
  //           </div>
  //         )}

  //         {/* Map through your existing navItems */}
  //         {navItems
  //           .filter((item) =>
  //             ["notifications", "kiosk-checkin", "adduser"].includes(item.id)
  //           )
  //           .map((item) => (
  //             <Link
  //               key={item.id}
  //               to={`/${item.id}`}
  //               onClick={() => setActiveNav(item.id)}
  //               className={`flex items-center ${
  //                 isExpanded ? "px-3 justify-start" : "px-2 justify-center"
  //               } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors relative ${
  //                 activeNav === item.id
  //                   ? "bg-gray-100 text-gray-900"
  //                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  //               }`}
  //               title={!isExpanded ? item.label : ""}
  //             >
  //               <item.icon className="h-5 w-5 flex-shrink-0" />
  //               {isExpanded && <span className="ml-3">{item.label}</span>}
  //               {item.count && isExpanded && (
  //                 <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
  //                   {item.count}
  //                 </span>
  //               )}
  //               {/* Show notification dot even when collapsed */}
  //               {item.count && !isExpanded && (
  //                 <span className="absolute top-2 right-2 bg-red-500 w-[0.6rem] h-[0.6rem] rounded-full"></span>
  //               )}
  //             </Link>
  //           ))}

  //         {/* Analytics */}
  //         <Link
  //           to="/analytics"
  //           onClick={() => setActiveNav("analytics")}
  //           className={`flex items-center ${
  //             isExpanded ? "px-3 justify-start" : "px-2 justify-center"
  //           } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors ${
  //             activeNav === "analytics"
  //               ? "bg-gray-100 text-gray-900"
  //               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  //           }`}
  //           title={!isExpanded ? "Analytics" : ""}
  //         >
  //           <BarChart3 className="h-5 w-5 flex-shrink-0" />
  //           {isExpanded && <span className="ml-3">Analytics</span>}
  //         </Link>

  //         {/* PAGES Section */}
  //         {isExpanded && (
  //           <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-6 px-3">
  //             PAGES
  //           </div>
  //         )}

  //         {/* Settings */}
  //         <Link
  //           to="/profile"
  //           onClick={() => setActiveNav("profile")}
  //           className={`flex items-center ${
  //             isExpanded ? "px-3 justify-start" : "px-2 justify-center"
  //           } py-2.5 text-sm font-medium rounded-lg mb-1 transition-colors ${
  //             activeNav === "profile"
  //               ? "bg-gray-100 text-gray-900"
  //               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  //           }`}
  //           title={!isExpanded ? "Settings" : ""}
  //         >
  //           <Settings className="h-5 w-5 flex-shrink-0" />
  //           {isExpanded && <span className="ml-3">Settings</span>}
  //         </Link>

  //         {/* Logout Button */}
  //         <button
  //           onClick={handleLogout}
  //           className={`w-full flex items-center ${
  //             isExpanded ? "px-3 justify-start" : "px-2 justify-center"
  //           } py-2.5 text-sm font-medium text-red-400 hover:bg-red-200/20 rounded-lg transition-colors mt-6`}
  //           title={!isExpanded ? "Logout" : ""}
  //         >
  //           <LogOut className="h-5 w-5 flex-shrink-0" />
  //           {isExpanded && <span className="ml-3">Logout</span>}
  //         </button>
  //       </nav>
  //     </div>
  //   );
  // };

  return (
    <section>
      <div className="flex h-screen bg-gray-50">
        <LightSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          handleLogout={handleLogout}
          navItems={navItems}
        />
      </div>
        <section>
          <Outlet />
        </section>
    </section> // <div className="min-h-screen">
    //   {/* Theme Selector
    //   <div className="fixed top-[3rem]   right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    //     <button
    //       onClick={() => setActiveTheme('light')}
    //       className={`px-4 py-2 text-sm font-medium transition-colors  ${
    //         activeTheme === 'light'
    //           ? 'bg-gray-900 text-white'
    //           : 'text-gray-700 hover:bg-gray-50'
    //       }`}
    //     >
    //       Light
    //     </button>
    //     <button
    //       onClick={() => setActiveTheme('dark')}
    //       className={`px-4 py-2 text-sm font-medium transition-colors ${
    //         activeTheme === 'dark'
    //           ? 'bg-gray-900 text-white'
    //           : 'text-gray-700 hover:bg-gray-50'
    //       }`}
    //     >
    //       Dark
    //     </button>
    //   </div> */}

    //   {activeTheme === 'light' ? (
    //     // Light Theme Layout
    //     <div className="flex h-screen bg-gray-50">
    //        <LightSidebar
    //         sidebarOpen={sidebarOpen}
    //         setSidebarOpen={setSidebarOpen}
    //         activeNav={activeNav}
    //         setActiveNav={setActiveNav}
    //         handleLogout={handleLogout}
    //         navItems={navItems}
    //       />

    //       <div className="absolute bottom-4 left-4 right-4">
    //   </div>
    //       {/* Overlay for mobile */}
    //       {sidebarOpen && (
    //         <div
    //           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    //           onClick={() => setSidebarOpen(false)}
    //         />
    //       )}

    //       {/* Main Content */}
    //       <div className="flex-1 flex flex-col overflow-hidden">
    //         {/* Top Bar */}
    //         <div className="bg-white border-b border-gray-200 px-6 py-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center">
    //               <button
    //                 onClick={() => setSidebarOpen(true)}
    //                 className="lg:hidden mr-4 p-1 rounded hover:bg-gray-100"
    //               >
    //                 <Menu className="h-5 w-5 text-gray-500" />
    //               </button>
    //               <h1 className="text-2xl font-light text-gray-900">Dashboard</h1>
    //             </div>
    //             <p className="text-gray-500 text-sm">Monitor visitor activity and system performance</p>
    //           </div>
    //         </div>

    //         {/* Content Area */}
    //         <div className="flex-1 overflow-auto p-6">
    //           {/* Stats Grid */}
    //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    //             {statsData.map((stat, index) => (
    //               <LightStatsCard key={index} {...stat} />
    //             ))}
    //           </div>

    //           {/* Tables */}
    //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    //             {visiblePendingApprovals > 0 ? <LightTable title="Pending Approvals" data={visiblePendingApprovals} />:  <div className="text-gray-500">No Pending Approvals</div>}
    //             <LightVisitorTable title="Current Visitors" data={visibleVisitors} />
    //           </div>

    //           {/* Action Button */}
    //           <div className="flex justify-end">
    //             <button className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
    //               <Download className="h-4 w-4" />
    //               <span>Export Report</span>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     // Dark Theme Layout
    //     <div className="flex h-screen bg-black">
    //       <DarkSidebar />

    //       {/* Overlay for mobile */}
    //       {sidebarOpen && (
    //         <div
    //           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    //           onClick={() => setSidebarOpen(false)}
    //         />
    //       )}

    //       {/* Main Content */}
    //       <div className="flex-1 flex flex-col overflow-hidden">
    //         {/* Top Bar */}
    //         <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
    //           <div className="flex items-center justify-between">
    //             <div className="flex items-center">
    //               <button
    //                 onClick={() => setSidebarOpen(true)}
    //                 className="lg:hidden mr-4 p-1 rounded hover:bg-gray-800"
    //               >
    //                 <Menu className="h-5 w-5 text-gray-400" />
    //               </button>
    //               <h1 className="text-2xl font-light text-white">Dashboard</h1>
    //             </div>
    //             <p className="text-gray-400 text-sm">Monitor visitor activity and system performance</p>
    //           </div>
    //         </div>

    //         {/* Content Area */}
    //         <div className="flex-1 overflow-auto p-6">
    //           {/* Stats Grid */}
    //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    //             {statsData.map((stat, index) => (
    //               <DarkStatsCard key={index} {...stat} />
    //             ))}
    //           </div>

    //           {/* Tables */}
    //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    //             <DarkTable title="Pending Approvals" data={pendingApprovals} />
    //             <DarkTable title="Current Visitors" data={currentVisitors} />
    //           </div>

    //           {/* Action Button */}
    //           <div className="flex justify-end">
    //             <button className="flex items-center space-x-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
    //               <Download className="h-4 w-4" />
    //               <span>Export Report</span>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default Dashbaord;