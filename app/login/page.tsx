"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";

function LoginForm() {
  const { logIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nextParam = searchParams.get("next");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    setLoading(true);
    const { error } = await logIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    toast.show("Logged in");
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/profile");
  }

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-medium tracking-tightest">Log In</h1>
        <p className="mt-2 text-sm text-silver/70">Log in to track orders and save your details.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-chrome-bright">
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-silver/70">
          New here?{" "}
          <Link href={`/signup${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""}`} className="text-chrome-bright">
            Create an account
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
