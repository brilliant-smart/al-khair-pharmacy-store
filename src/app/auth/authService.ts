import { loginRequest, logoutRequest } from "@/app/api/auth";
import { User } from "./types";

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string) {
  const response = await loginRequest(email, password);

  const data = response.data as LoginResponse;

  return {
    token: data.token,
    user: data.user,
  };
}

export async function logout() {
  try {
    await logoutRequest();
  } finally {
    // backend logout may fail, frontend must still clear state
    return true;
  }
}
