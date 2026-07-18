"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSent(true);
  }

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-medium tracking-tightest">Reset Password</h1>
        <p className="mt-2 text-sm text-silver/70">Enter your email and we'll send a reset link.</p>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-2 rounded-2xl bg-success/10 p-5 text-success"
            >
              <CheckCircle2 size={20} />
              If that email has an account, a reset link is on its way.
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error && <p className="text-xs text-error">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
        <p className="mt-6 text-center text-sm text-silver/70">
          <Link href="/login" className="text-chrome-bright">
            Back to login
          </Link>
        </p>
      </div>
    </Container>
  );
}
