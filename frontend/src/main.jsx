import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./components/LandingPage/HomePage.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin.jsx";
import AdminLogout from "./components/Admin/AdminLogout.jsx";
import ProductList from "./components/Admin/Pages/ProductList.jsx";
import ProductForm from "./components/Admin/Pages/ProductForm.jsx";
import DashboardOverview from "./components/Admin/Pages/DashboardOverview.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound.jsx";
import OrderHistory from "./components/Admin/Pages/OrderHistory.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/" element={<HomePage />} />
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Rute Admin yang Diproteksi */}
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
