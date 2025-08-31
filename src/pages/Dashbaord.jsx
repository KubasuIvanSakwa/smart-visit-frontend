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
  const { addNotification } = useNotification();
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const initialLoad = useRef(false);
  const cacheKey = 'dashboard_cache';
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes

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

  // Cache management functions
  const saveToCache = (data) => {
    const cacheData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    setCacheTimestamp(Date.now());
  };

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        const now = Date.now();
        if (now - cacheData.timestamp < cacheExpiry) {
          setVisitors(cacheData.visitors || []);
          setPendingApprovals(cacheData.pendingApprovals || []);
          setPeakHours(cacheData.peakHours || []);
          setMonthlyTrends(cacheData.monthlyTrends || []);
          setLastUpdated(new Date(cacheData.timestamp));
          setCacheTimestamp(cacheData.timestamp);
          console.log('Loaded dashboard data from cache');
          return true;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (err) {
      console.error('Error loading from cache:', err);
    }
    return false;
  };

  const fetchData = async (forceRefresh = false) => {
    try {
      // Clear any previous errors
      setError(null);

      if (!forceRefresh && loadFromCache()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      if (forceRefresh) {
        setIsRefreshing(true);
        addNotification("Refreshing data...", "info");
      } else {
        addNotification("Loading dashboard data...", "info");
      }

      const [visitorsRes, approvalsRes] = await Promise.all([
        api.get("/api/visitors/").catch((err) => {
          console.error("Visitors API error:", err);
          addNotification("Could not load visitors", "warning");
          return { data: [] };
        }),
        api.get("/api/dashboard/pending-approvals/").catch((err) => {
          console.error("Pending approvals API error:", err);
          addNotification("Could not load pending approvals", "warning");
          return { data: [] };
        }),
      ]);

      // Process visitors data
      let visitorsData = [];
      let peakHoursData = [];
      let monthlyTrendsData = [];

      if (visitorsRes.data && Array.isArray(visitorsRes.data)) {
        visitorsData = visitorsRes.data;
        setVisitors(visitorsData);
        console.log(visitorsData);

        // Compute stats from visitors data
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const todaysVisitors = visitorsData.filter(visitor => {
          const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
          return checkInDate >= startOfToday;
        });

        const monthlyVisitors = visitorsData.filter(visitor => {
          const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
          return checkInDate >= startOfMonth;
        });

        // Compute peak hours from today's visitors
        peakHoursData = Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          visitors: todaysVisitors.filter(visitor => {
            const checkInHour = new Date(visitor.check_in_time || visitor.created_at).getHours();
            return checkInHour === hour;
          }).length
        }));

        // Compute monthly trends (last 12 months)
        monthlyTrendsData = [];
        for (let i = 11; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const monthVisitors = visitorsData.filter(visitor => {
            const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
            return checkInDate >= monthStart && checkInDate <= monthEnd;
          });

          monthlyTrendsData.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            totalVisitors: monthVisitors.length,
            checkedIn: monthVisitors.filter(v => v.status === 'checked_in' || v.status === 'Checked In').length
          });
        }

        setPeakHours(peakHoursData);
        setMonthlyTrends(monthlyTrendsData);
      }

      // Process pending approvals data
      let approvalsData = [];
      if (approvalsRes.data && Array.isArray(approvalsRes.data)) {
        approvalsData = approvalsRes.data;
        setPendingApprovals(approvalsData);
      }

      // Save to cache only if we have some data
      if (visitorsData.length > 0 || approvalsData.length > 0) {
        const cacheData = {
          visitors: visitorsData,
          pendingApprovals: approvalsData,
          peakHours: peakHoursData,
          monthlyTrends: monthlyTrendsData
        };
        saveToCache(cacheData);
      }

      setLastUpdated(new Date());
      if (forceRefresh) {
        addNotification("Dashboard refreshed successfully", "success");
      } else {
        addNotification("Dashboard loaded successfully", "success");
      }
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
      setIsRefreshing(false);
    }
  };

  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('role') || 'admin';
  });

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchData(true);
  };

  useEffect(() => {
    if (!initialLoad.current) {
      initialLoad.current = true;
      fetchData();
    }

    // Set up polling every 30 seconds, but only if cache is expired
    const interval = setInterval(() => {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        const now = Date.now();
        if (now - cacheData.timestamp >= cacheExpiry) {
          fetchData();
        }
      } else {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

  // Calculate today's visitors correctly
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todaysVisitors = visibleVisitors.filter(visitor => {
    const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
    return checkInDate >= startOfToday;
  });

  // Calculate yesterday's visitors for trend comparison
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
  const yesterdaysVisitors = visibleVisitors.filter(visitor => {
    const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
    return checkInDate >= startOfYesterday && checkInDate <= endOfYesterday;
  });

  // Calculate this month's visitors
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyVisitors = visibleVisitors.filter(visitor => {
    const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
    return checkInDate >= startOfMonth;
  });

  // Calculate last month's visitors for trend comparison
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  const lastMonthVisitors = visibleVisitors.filter(visitor => {
    const checkInDate = new Date(visitor.check_in_time || visitor.created_at);
    return checkInDate >= lastMonth && checkInDate <= lastMonthEnd;
  });

  // Calculate trends
  const calculateTrend = (current, previous) => {
    if (previous === 0) return { num: current > 0 ? "+100%" : "0%", trend: current > 0 ? "up" : "neutral" };
    const percentChange = ((current - previous) / previous * 100).toFixed(1);
    const trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";
    const sign = percentChange > 0 ? "+" : "";
    return { num: `${sign}${percentChange}%`, trend };
  };

  const todaysTrend = calculateTrend(todaysVisitors.length, yesterdaysVisitors.length);
  const monthlyTrend = calculateTrend(monthlyVisitors.length, lastMonthVisitors.length);

  // Calculate average visit duration from actual data
  const calculateAvgDuration = () => {
    const checkedOutVisitors = visibleVisitors.filter(v => v.check_out_time && v.check_in_time);
    if (checkedOutVisitors.length === 0) return "2h 30m";

    const totalDuration = checkedOutVisitors.reduce((total, visitor) => {
      const checkIn = new Date(visitor.check_in_time);
      const checkOut = new Date(visitor.check_out_time);
      const duration = (checkOut - checkIn) / (1000 * 60 * 60); // hours
      return total + duration;
    }, 0);

    const avgHours = totalDuration / checkedOutVisitors.length;
    const hours = Math.floor(avgHours);
    const minutes = Math.round((avgHours - hours) * 60);

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const avgDuration = calculateAvgDuration();

  const statsData = [
    {
      icon: Users,
      title: "Today's Visitors",
      value: todaysVisitors.length.toString(),
      change: {
        num: todaysTrend.num,
        text: "from yesterday",
      },
      trend: todaysTrend.trend,
    },
    {
      icon: UserCheck,
      title: "Total This Month",
      value: monthlyVisitors.length.toString(),
      change: {
        num: monthlyTrend.num,
        text: "from last month",
      },
      trend: monthlyTrend.trend,
    },
    {
      icon: AlertCircle,
      title: "Currently Pending",
      value: visiblePendingApprovals.length.toString(),
      change: {
        num: "",
        text: "Awaiting approval",
      },
    },
    {
      icon: Clock,
      title: "Avg Visit Duration",
      value: avgDuration,
      change: {
        num: "",
        text: "Based on completed visits",
      },
    },
  ];

  // If user is a host, show only the visitors table
  if (currentRole === "host") {
    return (
      <div className="min-h-screen">
        <div className="relative overflow-y-hidden flex h-auto bg-gray-50">
          <div className="absolute bottom-4 left-4 right-4"></div>
          <div className="flex-1 flex flex-col overflow-hidden pr-1">
            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 h-full pt-[2rem]">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Visitors</h1>
                <p className="text-gray-600">View and manage visitors assigned to you</p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                    {cacheTimestamp && (
                      <span className="ml-2 text-xs text-blue-600">
                        (cached)
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Visitors Table */}
              <div className="w-full">
                <VisitorsTable visitors={visibleVisitors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin/Full dashboard view
  return (
    <div className="min-h-screen">
      <div className="relative overflow-y-hidden  flex h-auto bg-gray-50">
        <div className="absolute bottom-4 left-4 right-4"></div>
        <div className="flex-1 flex flex-col overflow-hidden pr-1">
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6 h-full pt-[2rem]">
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                    {cacheTimestamp && (
                      <span className="ml-2 text-xs text-blue-600">
                        (cached)
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                <TrendingUp className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {statsData.map((stat, index) => (
                <LightStatsCard key={index} {...stat} />
              ))}
            </div>
            <div className="w-full">
              <ResponsiveChartsContainer />
              <VisitorsTable visitors={visibleVisitors} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbaord;
