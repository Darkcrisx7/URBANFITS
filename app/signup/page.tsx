"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    login(name, email);
    toast.show("Account created — verification email would be sent here in production");
    router.push("/profile");
  }

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-medium tracking-tightest">Create Account</h1>
        <p className="mt-2 text-sm text-stone-500">
          Demo authentication — no real account or email is created yet.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Create Account
          </Button>
          <Button type="button" variant="secondary" size="lg" className="w-full">
            Continue with Google
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
