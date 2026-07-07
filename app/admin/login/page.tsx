"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import { useToast } from "@/contexts/toast-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.session) {
      setError(signInError?.message || "Invalid email or password.");
      setLoading(false);
      return;
    }
    if (!ADMIN_EMAILS.includes(data.session.user.email ?? "")) {
      await supabase.auth.signOut();
      setError("This account isn't authorized for admin access.");
      setLoading(false);
      return;
    }
    toast.show("Welcome back, admin");
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <Container className="max-w-sm">
        <div className="rounded-2xl border border-stone-200 bg-paper p-8 shadow-soft">
          <div className="mb-6 flex flex-col items-center text-center">
            <Image src="/logo.jpeg" alt="Urban Fits" width={56} height={56} className="rounded-full" />
            <h1 className="mt-3 font-display text-xl font-medium">Admin Login</h1>
            <p className="mt-1 text-xs text-stone-500">Restricted to store administrators</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-xs text-error">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
