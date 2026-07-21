import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./components/LandingPage/HomePage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AdminLogin from "./components/Admin/AdminLogin";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin";
import AdminLogout from "./components/Admin/AdminLogout";
import ProductList from "./components/Admin/Pages/ProductList";
import ProductForm from "./components/Admin/Pages/ProductForm";
import DashboardOverview from "./components/Admin/Pages/DashboardOverview";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import OrderHistory from "./components/Admin/Pages/OrderHistory";
import TermsAndConditions from "./components/LandingPage/TermsAndConditions";
import PrivacyPolicy from "./components/LandingPage/PrivacyPolicy";
import GuestRoute from "./components/GuestRoute";

createRoot(document.getElementById("root")!).render(
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
