import { api } from "@/app/lib/api";

export const getUsers = () => {
  return api.get("/admin/users");
};

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: "master_admin" | "section_head";
  department_id?: number;
}) => {
  return api.post("/admin/users", data);
};

export const updateUser = (
  id: number,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "master_admin" | "section_head";
    department_id?: number;
    is_active?: boolean;
  }
) => {
  return api.patch(`/admin/users/${id}`, data);
};

export const deleteUser = (id: number) => {
  return api.delete(`/admin/users/${id}`);
};
