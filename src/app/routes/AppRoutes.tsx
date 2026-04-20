import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";

import Index from "@/pages/Index";
import Products from "@/pages/public/Products";
import ProductDetails from "@/pages/public/ProductDetails";

import Login from "@/pages/auth/Login";
import NotFound from "@/pages/errors/NotFound";
import Unauthorized from "@/app/pages/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      {/* Product detail pages disabled - redirect to home */}
      <Route path="/products/:slug" element={<Navigate to="/" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* System */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
