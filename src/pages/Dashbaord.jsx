import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  Clock,
  TrendingUp,
  Download,
  UserCheck,
  Search,
  UserPlus,
  AlertCircle,
  User,
  MonitorCheck,
  LogOut,
  ChevronRight,
  Home,
  BarChart3,
  Calendar,
  Bell,
  Menu,
  X,
  Cog as Settings,
  MessageCircleMore,
} from "lucide-react";
import { Link, Outlet } from "react-router";
import { useNotification } from "../components/NotificationProvider";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import LightSidebar from "../components/LightSidebar";
import LightStatsCard from "../components/LightStatsCard";
import DailyChart from "./ResponsiveChartsContainer";
import ResponsiveChartsContainer from "./ResponsiveChartsContainer";
import VisitorsTable from "../components/VisitorsTable";
import TopNav from "../components/TopNav";

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
      change: {
        num: "+8%",
        text: "from yesterday",
      },
      trend: "up",
    },
    {
      icon: UserCheck,
      title: "Total This Month",
      value: visibleVisitors
        .filter((v) => v.status !== "Checked Out")
        .length.toString(),
      change: {
        num: "+15% ",
        text: "from last month",
      },
      trend: "up",
    },
    {
      icon: AlertCircle,
      title: "Currently Pending",
      value: visiblePendingApprovals
        .filter((v) => v.status !== "Checked Out")
        .length.toString(),
      change: {
        num: "",
        text: "Awaiting approval",
      },
    },
    {
      icon: Clock,
      title: "Avg Visit Duration",
      value: "6h",
      change: {
        num: "-12%",
        text: "from last week",
      },
      trend: "down",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-50">
        <div className="absolute bottom-4 left-4 right-4"></div>
        <div className="flex-1 flex flex-col overflow-hidden pr-1">
          <TopNav />

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6 h-full pt-[7rem]">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {statsData.map((stat, index) => (
                <LightStatsCard key={index} {...stat} />
              ))}
            </div>
            <div className="w-full">
              <ResponsiveChartsContainer />
              <VisitorsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbaord;
