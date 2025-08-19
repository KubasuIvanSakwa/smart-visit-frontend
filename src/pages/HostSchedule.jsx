import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";

const HostSchedule = () => {
  const [activeTheme, setActiveTheme] = useState("light");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day"); // day, week
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, confirmed, pending, completed

  // Sample data - in real app this would come from API
  const meetings = [
    {
      id: 1,
      visitorName: "Sarah Johnson",
      company: "TechCorp Solutions",
      purpose: "Business Meeting",
      time: "09:00",
      duration: "60 min",
      status: "confirmed",
      phone: "+1 234 567 8901",
      email: "sarah.j@techcorp.com",
      notes: "Quarterly review discussion",
      date: "2025-07-25",
    },
    {
      id: 2,
      visitorName: "Michael Chen",
      company: "StartupXYZ",
      purpose: "Partnerships",
      time: "11:30",
      duration: "45 min",
      status: "pending",
      phone: "+1 234 567 8902",
      email: "m.chen@startupxyz.com",
      notes: "Partnership opportunity discussion",
      date: "2025-07-25",
    },
    {
      id: 3,
      visitorName: "Emma Williams",
      company: "Design Studio",
      purpose: "Consultation",
      time: "14:00",
      duration: "30 min",
      status: "confirmed",
      phone: "+1 234 567 8903",
      email: "emma@designstudio.com",
      notes: "UI/UX consultation for new project",
      date: "2025-07-25",
    },
    {
      id: 4,
      visitorName: "David Rodriguez",
      company: "Global Enterprises",
      purpose: "Business Meeting",
      time: "16:00",
      duration: "90 min",
      status: "completed",
      phone: "+1 234 567 8904",
      email: "d.rodriguez@global.com",
      notes: "Contract negotiation meeting",
      date: "2025-07-25",
    },
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed:
        activeTheme === "light"
          ? "text-green-600 bg-green-50 border-green-200"
          : "text-green-400 bg-green-900/20 border-green-800",
      pending:
        activeTheme === "light"
          ? "text-yellow-600 bg-yellow-50 border-yellow-200"
          : "text-yellow-400 bg-yellow-900/20 border-yellow-800",
      completed:
        activeTheme === "light"
          ? "text-gray-600 bg-gray-50 border-gray-200"
          : "text-gray-400 bg-gray-900/20 border-gray-800",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBack = () => {
    // In a real app, this would navigate back
    window.history.back();
  };

  // Theme Selector
  const ThemeSelector = () => (
    <div className="fixed top-4 right-6 z-50 flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setActiveTheme("light")}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === "light"
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setActiveTheme("dark")}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTheme === "dark"
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        Dark
      </button>
    </div>
  );

  const MeetingCard = ({ meeting }) => (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-sm ${
        activeTheme === "light"
          ? "bg-white border-gray-100 hover:border-gray-200"
          : "bg-gray-900 border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-full ${
              activeTheme === "light" ? "bg-gray-100" : "bg-gray-800"
            }`}
          >
            <User
              className={`h-4 w-4 ${
                activeTheme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <h3
              className={`font-medium ${
                activeTheme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {meeting.visitorName}
            </h3>
            <p
              className={`text-sm ${
                activeTheme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {meeting.company}
            </p>
          </div>
        </div>
        <div
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            meeting.status
          )}`}
        >
          {getStatusIcon(meeting.status)}
          <span className="capitalize">{meeting.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Clock
            className={`h-4 w-4 ${
              activeTheme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm ${
              activeTheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {meeting.time} ({meeting.duration})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText
            className={`h-4 w-4 ${
              activeTheme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm ${
              activeTheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {meeting.purpose}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone
            className={`h-4 w-4 ${
              activeTheme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm ${
              activeTheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {meeting.phone}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail
            className={`h-4 w-4 ${
              activeTheme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm ${
              activeTheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {meeting.email}
          </span>
        </div>
      </div>

      {meeting.notes && (
        <div
          className={`p-3 rounded-lg ${
            activeTheme === "light" ? "bg-gray-50" : "bg-gray-800"
          }`}
        >
          <p
            className={`text-sm ${
              activeTheme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            <span className="font-medium">Notes:</span> {meeting.notes}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        activeTheme === "light" ? "bg-gray-50" : "bg-black"
      }`}
    >
      <ThemeSelector />
      <button
        onClick={handleBack}
        className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm m-3 ${
          activeTheme === "light"
            ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            : "bg-gray-900 hover:bg-gray-800 text-white border-gray-800 hover:border-gray-700"
        }`}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                activeTheme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}
            >
              <Calendar
                className={`h-8 w-8 ${
                  activeTheme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              />
            </div>

            <h1
              className={`text-3xl md:text-4xl font-light mb-4 tracking-tight ${
                activeTheme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Host Schedule
            </h1>

            <p
              className={`text-lg max-w-lg mx-auto leading-relaxed ${
                activeTheme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Manage your visitor meetings and appointments
            </p>
          </div>

          {/* Controls */}
          <div
            className={`rounded-lg border p-6 mb-8 ${
              activeTheme === "light"
                ? "bg-white border-gray-100"
                : "bg-gray-900 border-gray-800"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Date Navigation */}
              <div className="flex items-center space-x-4">
                <button
                  className={`p-2 rounded-lg border transition-colors ${
                    activeTheme === "light"
                      ? "border-gray-200 hover:bg-gray-50"
                      : "border-gray-800 hover:bg-gray-800"
                  }`}
                >
                  <ChevronLeft
                    className={`h-4 w-4 ${
                      activeTheme === "light"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <div className="text-center">
                  <p
                    className={`font-medium ${
                      activeTheme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {formatDate(selectedDate)}
                  </p>
                  <p
                    className={`text-sm ${
                      activeTheme === "light"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {filteredMeetings.length} meetings scheduled
                  </p>
                </div>

                <button
                  className={`p-2 rounded-lg border transition-colors ${
                    activeTheme === "light"
                      ? "border-gray-200 hover:bg-gray-50"
                      : "border-gray-800 hover:bg-gray-800"
                  }`}
                >
                  <ChevronRight
                    className={`h-4 w-4 ${
                      activeTheme === "light"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      activeTheme === "light"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      activeTheme === "light"
                        ? "bg-white border-gray-200 text-gray-900 focus:border-gray-400"
                        : "bg-gray-800 border-gray-700 text-white focus:border-gray-600"
                    }`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    activeTheme === "light"
                      ? "bg-white border-gray-200 text-gray-900 focus:border-gray-400"
                      : "bg-gray-800 border-gray-700 text-white focus:border-gray-600"
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Meetings List */}
          {filteredMeetings.length > 0 ? (
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-12 rounded-lg border ${
                activeTheme === "light"
                  ? "bg-white border-gray-100"
                  : "bg-gray-900 border-gray-800"
              }`}
            >
              <Calendar
                className={`h-12 w-12 mx-auto mb-4 ${
                  activeTheme === "light" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${
                  activeTheme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                No meetings found
              </h3>
              <p
                className={`${
                  activeTheme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No meetings scheduled for this date"}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div
            className={`mt-8 p-4 rounded-lg border ${
              activeTheme === "light"
                ? "bg-white border-gray-100"
                : "bg-gray-900 border-gray-800"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p
                  className={`text-2xl font-light ${
                    activeTheme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {meetings.filter((m) => m.status === "confirmed").length}
                </p>
                <p
                  className={`text-sm ${
                    activeTheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Confirmed
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-light ${
                    activeTheme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {meetings.filter((m) => m.status === "pending").length}
                </p>
                <p
                  className={`text-sm ${
                    activeTheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Pending
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-light ${
                    activeTheme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {meetings.filter((m) => m.status === "completed").length}
                </p>
                <p
                  className={`text-sm ${
                    activeTheme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostSchedule;
