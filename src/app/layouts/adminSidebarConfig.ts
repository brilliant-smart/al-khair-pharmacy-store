import type { Role } from "@/app/auth/types";

export interface SidebarItem {
  label: string;
  path: string;
  roles: Role[];
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Products",
    path: "/admin/products",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Suppliers",
    path: "/admin/suppliers",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Purchase Orders",
    path: "/admin/purchase-orders",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Sales",
    path: "/admin/sales",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Financial Reports",
    path: "/admin/reports",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Price History",
    path: "/admin/reports/price-history",
    roles: ["master_admin"],
  },
  {
    label: "Supplier Comparison",
    path: "/admin/reports/supplier-comparison",
    roles: ["master_admin"],
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    roles: ["master_admin", "section_head"],
  },
  {
    label: "Users",
    path: "/admin/users",
    roles: ["master_admin"],
  },
];
