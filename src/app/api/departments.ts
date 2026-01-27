import { api } from "@/app/lib/api";

export const getDepartments = () => {
  return api.get("/departments");
};
