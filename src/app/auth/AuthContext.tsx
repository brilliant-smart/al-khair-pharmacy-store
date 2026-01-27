import { createContext, useContext, useEffect, useState } from "react";
import { AuthState } from "./types";
import { tokenStorage } from "./token";
import * as authService from "./authService";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: tokenStorage.get(),
    isAuthenticated: false,
  });

  useEffect(() => {
    if (state.token) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
      }));
    }
  }, [state.token]);

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);

    tokenStorage.set(token);

    setState({
      user,
      token,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await authService.logout();
    tokenStorage.clear();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
