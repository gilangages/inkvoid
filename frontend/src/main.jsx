import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./components/LandingPage/HomePage.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Index route otomatis ke dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
