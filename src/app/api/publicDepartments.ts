import { api } from "@/app/lib/api";

export interface PublicDepartment {
  id: number;
  name: string;
  slug: string;
}

export async function fetchPublicDepartments() {
  const res = await api.get("/departments");
  const raw = res.data;
  if (Array.isArray(raw)) return raw as PublicDepartment[];
  if (raw && typeof raw === "object" && Array.isArray(raw.data))
    return raw.data as PublicDepartment[];
  return [];
}
