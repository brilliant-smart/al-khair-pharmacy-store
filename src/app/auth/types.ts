export type Role = "master_admin" | "section_head";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department_id: number | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
