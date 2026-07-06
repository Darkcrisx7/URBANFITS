"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, setAuth } from "@/lib/storage";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// DEMO-ONLY: accepts any name/email and "logs in" locally. There is no
// password check, no verification email, and no server session. Replace
// with Supabase Auth (see /lib/auth-supabase.example.ts) before launch.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  function login(name: string, email: string) {
    const u = { id: `u_${Date.now()}`, name, email };
    setUser(u);
    setAuth(u);
  }

  function logout() {
    setUser(null);
    setAuth(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
