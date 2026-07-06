"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { setAdminAuth } from "@/lib/storage";
import { useToast } from "@/contexts/toast-context";

// DEMO-ONLY credentials. Replace with real Supabase Auth + role check
// (see lib/auth-supabase.example.ts) before this ever goes near production.
const DEMO_ADMIN_EMAIL = "admin@urbanfits.store";
const DEMO_ADMIN_PASSWORD = "urbanfits123";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      setAdminAuth(true);
      toast.show("Welcome back, admin");
      router.push("/admin");
    } else {
      setError("Invalid credentials. Try the demo credentials shown below.");
    }
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
            <Button type="submit" size="lg" className="w-full">
              Log In
            </Button>
          </form>
          <div className="mt-6 rounded-xl bg-stone-50 p-3 text-center text-xs text-stone-500">
            Demo credentials: <br />
            <span className="font-medium text-ink">{DEMO_ADMIN_EMAIL}</span> /{" "}
            <span className="font-medium text-ink">{DEMO_ADMIN_PASSWORD}</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
