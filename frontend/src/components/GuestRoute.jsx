import { Navigate, Outlet } from "react-router";

export default function GuestRoute() {
  const token = localStorage.getItem("token");

  const isAuthenticated = token && token !== null && token !== "undefined";

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
