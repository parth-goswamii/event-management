import React from "react";
import { Navigate } from "react-router-dom";
import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
import Settings from "../pages/Pages/Profile/Settings/Settings";
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import PasswordUpdatePage from "../pages/Authentication/PasswordUpdatePage";
import ChangePasswordPage from "../pages/Authentication/ChangePasswordPage";
import Dashboard from "../pages/DashboardPage/Dashboard";
import EventPage from "../pages/EventPage/EventPage";

import APIKey from "../pages/APIKey";
import { components } from "react-select";
import ServicePage from "../pages/ServicePage/ServicePage";


const authProtectedRoutes = [
  { path: "/apps-api-key", component: <APIKey /> },
  { path: "/pages-profile", component: <SimplePage /> },
  { path: "/pages-profile-settings", component: <Settings /> },
  {path: "/dashboard", component : <Dashboard/>},
  {path:"/event",component : <EventPage/>},
  {path:"/service",component : <ServicePage/>},


  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "update-password", component: <PasswordUpdatePage /> },
  { path: "/change-password", component: <ChangePasswordPage /> },
];

export { authProtectedRoutes, publicRoutes };
