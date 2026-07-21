import { Navigate, Outlet } from "react-router";
export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // Pengecekan lebih ketat: pastikan bukan null, bukan string "null", dan bukan string "undefined"
  const isAuthenticated = token && token !== "null" && token !== "undefined";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
