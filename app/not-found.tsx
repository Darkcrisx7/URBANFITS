"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-8xl font-medium tracking-tightest text-stone-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-medium">This page doesn't exist</h1>
      <p className="mt-2 text-stone-500">The page you're looking for may have been moved or removed.</p>
      <Link href="/">
        <Button size="lg" className="mt-8">
          Back to Home
        </Button>
      </Link>
    </Container>
  );
}
