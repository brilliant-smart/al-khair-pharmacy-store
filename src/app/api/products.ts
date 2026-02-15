import { api } from "@/app/lib/api";

export const getProducts = (departmentId?: number) => {
  return api.get("/products", {
    params: departmentId ? { department_id: departmentId } : undefined,
  });
};

export const getProduct = (id: number) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (data: FormData) => {
  return api.post("/products", data);
};

export const updateProduct = (id: number, data: FormData) => {
  data.append('_method', 'PUT');
  return api.post(`/admin/products/${id}`, data);
};

export const deleteProduct = (id: number) => {
  return api.delete(`/admin/products/${id}`);
};
