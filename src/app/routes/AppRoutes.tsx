import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import AdminRoutes from "./AdminRoutes";
import NotFound from "@/pages/errors/NotFound";
import Unauthorized from "../pages/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
