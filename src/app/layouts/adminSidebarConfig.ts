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
    label: "Users",
    path: "/admin/users",
    roles: ["master_admin"],
  },
];
