"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { upsertCustomerRecord } from "@/lib/storage";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logIn: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(supabaseUser: { id: string; email?: string; user_metadata?: any } | null): AuthUser | null {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: supabaseUser.user_metadata?.name || (supabaseUser.email ?? "").split("@")[0],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toAuthUser(data.session?.user ?? null));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user ?? null));
      // Safety net: whenever the browser confirms an active session (this
      // fires only once the session is fully established, avoiding the
      // timing gap right after signUp() where a request could still go
      // out unauthenticated), make sure this customer's row exists. It's
      // an upsert, so calling it again on every login is harmless.
      if (session?.user) {
        const authed = toAuthUser(session.user)!;
        upsertCustomerRecord(authed.id, authed.name, authed.email).catch((err) => {
          console.warn("[AuthProvider] customer row sync failed:", err?.message);
        });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    // Not awaited/thrown here on purpose — right after signUp() there can
    // be a brief gap before the new session is fully active, so this can
    // fail here even though everything is fine. The onAuthStateChange
    // listener above retries this as soon as the session is confirmed, so
    // signup itself should never fail because of it.
    if (data.user) {
      upsertCustomerRecord(data.user.id, name, email).catch(() => {});
    }
    return {};
  }

  async function logIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) return { error: error.message };
    return {};
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
