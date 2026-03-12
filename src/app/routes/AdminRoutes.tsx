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

import InventoryAnalytics from "@/pages/admin/InventoryAnalytics";

import Profile from "@/pages/admin/Profile";

import SupplierList from "@/pages/admin/suppliers/SupplierList";
import SupplierCreate from "@/pages/admin/suppliers/SupplierCreate";
import SupplierEdit from "@/pages/admin/suppliers/SupplierEdit";
import PurchaseOrderList from "@/pages/admin/purchase-orders/PurchaseOrderList";
import PurchaseOrderCreate from "@/pages/admin/purchase-orders/PurchaseOrderCreate";
import PurchaseOrderEdit from "@/pages/admin/purchase-orders/PurchaseOrderEdit";
import PurchaseOrderDetail from "@/pages/admin/purchase-orders/PurchaseOrderDetail";
import BatchList from "@/pages/admin/batches/BatchList";
import SalesList from "@/pages/admin/sales/SalesList";
import SaleCreate from "@/pages/admin/sales/SaleCreate";
import SalesAnalytics from "@/pages/admin/sales/SalesAnalytics";
import POSTerminal from "@/pages/admin/pos/POSTerminal";
import FinancialReports from "@/pages/admin/reports/FinancialReports";
import PriceHistoryDashboard from "@/pages/admin/reports/PriceHistoryDashboard";
import SupplierPriceComparison from "@/pages/admin/reports/SupplierPriceComparison";
import BackupRestore from "@/pages/admin/system/BackupRestore";
import AuditLogs from "@/pages/admin/system/AuditLogs";

import ExpenseList from "@/pages/admin/expenses/ExpenseList";
import ExpenseCreate from "@/pages/admin/expenses/ExpenseCreate";
import ExpenseEdit from "@/pages/admin/expenses/ExpenseEdit";
import ExpenseAnalytics from "@/pages/admin/expenses/ExpenseAnalytics";

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

          {/* Suppliers Routes */}
          <Route
            path="suppliers"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <SupplierList />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="suppliers/create"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin"]}
              >
                <SupplierCreate />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="suppliers/:id/edit"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin"]}
              >
                <SupplierEdit />
              </RoleProtectedRoute>
            }
          />

          {/* Purchase Orders Routes */}
          <Route
            path="purchase-orders"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <PurchaseOrderList />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="purchase-orders/create"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <PurchaseOrderCreate />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="purchase-orders/:id/edit"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <PurchaseOrderEdit />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="purchase-orders/:id"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <PurchaseOrderDetail />
              </RoleProtectedRoute>
            }
          />

          {/* Batch Tracking Routes */}
          <Route
            path="batches"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <BatchList />
              </RoleProtectedRoute>
            }
          />

          {/* POS Terminal */}
          <Route
            path="pos"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <POSTerminal />
              </RoleProtectedRoute>
            }
          />

          {/* Sales Routes */}
          <Route
            path="sales"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <SalesList />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="sales/create"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <SaleCreate />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="sales/analytics"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <SalesAnalytics />
              </RoleProtectedRoute>
            }
          />

          {/* Financial Reports Route */}
          <Route
            path="reports"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <FinancialReports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="reports/price-history"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin"]}
              >
                <PriceHistoryDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="reports/supplier-comparison"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin"]}
              >
                <SupplierPriceComparison />
              </RoleProtectedRoute>
            }
          />

          {/* Analytics Route */}
          <Route
            path="analytics"
            element={
              <RoleProtectedRoute
                allowedRoles={["master_admin", "section_head"]}
              >
                <InventoryAnalytics />
              </RoleProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route path="profile" element={<Profile />} />

          {/* Backup & Restore (All Users - Restore restricted in component) */}
          <Route path="system/backups" element={<BackupRestore />} />

          {/* Audit Logs (Master Admin Only) */}
          <Route
            path="system/audit-logs"
            element={
              <RoleProtectedRoute allowedRoles={["master_admin"]}>
                <AuditLogs />
              </RoleProtectedRoute>
            }
          />

          {/* Expenses Routes */}
          <Route path="expenses" element={<ExpenseList />} />
          <Route path="expenses/create" element={<ExpenseCreate />} />
          <Route path="expenses/:id/edit" element={<ExpenseEdit />} />
          <Route path="expenses/analytics" element={<ExpenseAnalytics />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}
