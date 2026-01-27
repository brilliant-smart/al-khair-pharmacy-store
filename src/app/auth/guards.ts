import { User } from "./types";

export const isAuthenticated = (user: User | null) => !!user;

export const isMasterAdmin = (user: User | null) =>
  user?.role === "master_admin";

export const isSectionHead = (user: User | null) =>
  user?.role === "section_head";

export const canAccessDepartment = (
  user: User | null,
  departmentId: number,
) => {
  if (!user) return false;
  if (user.role === "master_admin") return true;
  return user.department_id === departmentId;
};
