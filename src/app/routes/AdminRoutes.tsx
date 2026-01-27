import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/app/layouts/AdminLayout";

import Dashboard from "@/pages/admin/Dashboard";
import ProductList from "@/pages/admin/products/ProductList";
import ProductCreate from "@/pages/admin/products/ProductCreate";
import ProductEdit from "@/pages/admin/products/ProductEdit";

import UserList from "@/pages/admin/users/UserList";
import UserCreate from "@/pages/admin/users/UserCreate";
import UserEdit from "@/pages/admin/users/UserEdit";

import RoleProtectedRoute from "./RoleProtectedRoute";

export default function AdminRoutes() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route
            path="dashboard"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="products"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <ProductList />
              </RoleProtectedRoute>
            }
          >
            <Route
              path="create"
              element={
                <RoleProtectedRoute
                  allowedRoles={["master_admin", "section_head"]}
                >
                  <ProductCreate />
                </RoleProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <RoleProtectedRoute
                  allowedRoles={["master_admin", "section_head"]}
                >
                  <ProductEdit />
                </RoleProtectedRoute>
              }
            />
          </Route>

          <Route
            path="users"
            element={
              <RoleProtectedRoute allowedRoles={["master_admin"]}>
                <UserList />
              </RoleProtectedRoute>
            }
          >
            <Route
              path="create"
              element={
                <RoleProtectedRoute allowedRoles={["master_admin"]}>
                  <UserCreate />
                </RoleProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <RoleProtectedRoute allowedRoles={["master_admin"]}>
                  <UserEdit />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}
