import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./components/LandingPage/HomePage.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin.jsx";
import AdminLogout from "./components/Admin/AdminLogout.jsx";
import ProductList from "./components/Admin/Pages/ProductList.jsx";
import ProductForm from "./components/Admin/Pages/ProductForm.jsx";
import DashboardOverview from "./components/Admin/Pages/DashboardOverview.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound.jsx";
import OrderHistory from "./components/Admin/Pages/OrderHistory.jsx";
import TermsAndConditions from "./components/LandingPage/TermsAndConditions.jsx";
import PrivacyPolicy from "./components/LandingPage/PrivacyPolicy.jsx";
import GuestRoute from "./components/GuestRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Redirect Route */}
        {/* jika user akses /login otomatis ke /admin/login */}
        {/* Prop 'replace' agar history browser tidak numpuk (user ga bisa back ke /login) */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        {/* --- GUEST ROUTE --- */}
        {/* Hanya bisa diakses jika BELUM login. Kalau sudah login, mental ke dashboard */}
        <Route element={<GuestRoute />}>
          <Route path="admin/login" element={<AdminLogin />} />
        </Route>

        {/* --- PROTECTED ROUTE --- */}
        {/* Hanya bisa diakses jika SUDAH login. Kalau belum, mental ke login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<LayoutAdmin />}>
            {/* Index route otomatis ke dashboard */}
            <Route index element={<DashboardOverview />} />

            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductList />} />
            <Route path="upload" element={<ProductForm />} />
            <Route path="logout" element={<AdminLogout />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
