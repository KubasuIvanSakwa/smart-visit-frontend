import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import Layout from "./pages/Layout";
import Landingpage from "./pages/Landingpage";
import { RouterProvider } from "react-router";
import CheckIn from "./pages/Checkin";
import BadgePage from "./components/BadgePage";
import VisitorDetails from "./pages/VisitorDetails";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FormBuilder from "./pages/FormBuilder";
import Reports from "./pages/Reports";
// import VisitorApprovals from './pages/VisitorApprovals';
// import Dashbaord from './pages/Dashbaord';
import HostDashboard from "./pages/HostDashboard";
import NewKiosk from "./pages/NewKiosk";
import Profile from "./pages/NewProfile";
import NewLogin from "./pages/NewLogin";
import VisitorEntry from "./pages/VisitorEntry";
import Analytics from "./pages/ResponsiveChartsContainer";
import LoadingSpinnerDemo from "./components/LoadingSpinner";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./components/NotificationProvider";
import HostSchedule from "./pages/HostSchedule";
import NotificationsPage from "./pages/NotificationPage";
import AddUser from "./pages/AddUser";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import Dashbaord from "./pages/Dashbaord";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute />}>
          <Route
            index
            element={
              <>
                <Navbar />
                <Landingpage />
              </>
            }
          />
          <Route path="login" element={<NewLogin />} />
          <Route path="signup" element={<Register />} />
          <Route path="kiosk-checkin" element={<NewKiosk />} />
        </Route>

        {/* <Route path="check-in" element={<CheckIn />} /> */}
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/entry" element={<VisitorEntry />} /> */}

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
                <Route index element={<Dashbaord />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="adduser" element={<AddUser />} />
                <Route path="kiosk-checkin" element={<NewKiosk />} />
                <Route path="visitors" element={<VisitorDetails />} />
            </Route>
        </Route>
      </>
    ),
    {
      basename: import.meta.env.BASE_URL || "/",
    }
  );

  return (
    <NotificationProvider>
      <Suspense fallback={<LoadingSpinnerDemo />}>
        <RouterProvider router={routes} />
      </Suspense>
    </NotificationProvider>
  );
}

export default App;
