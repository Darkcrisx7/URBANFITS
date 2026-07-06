"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-success"
          >
            <CheckCircle2 size={18} />
            You're on the list — watch your inbox.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className={compact ? "flex flex-col gap-3" : "flex flex-col gap-3 sm:flex-row sm:max-w-md"}
          >
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={compact ? "" : "sm:flex-1"}
            />
            <Button type="submit" variant={compact ? "outline" : "primary"} className="shrink-0">
              Subscribe <ArrowRight size={16} />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
