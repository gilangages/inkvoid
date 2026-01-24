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

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="login" />
          <Route path="dashboard" />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
