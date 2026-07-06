"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    login(email.split("@")[0], email);
    toast.show("Logged in");
    router.push("/profile");
  }

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-medium tracking-tightest">Log In</h1>
        <p className="mt-2 text-sm text-stone-500">
          Demo authentication — any email/password combination signs you in locally.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-accent">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Log In
          </Button>
          <Button type="button" variant="secondary" size="lg" className="w-full">
            Continue with Google
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          New here?{" "}
          <Link href="/signup" className="text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </Container>
  );
}
