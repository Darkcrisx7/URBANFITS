"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./hero-scene"), { ssr: false });

export function Hero3DLazy() {
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallViewport = window.innerWidth < 768;
    // Skip WebGL entirely on mobile and reduced-motion — this is the main
    // performance lever: the 3D canvas simply never mounts there, so there's
    // no Three.js bundle downloaded, parsed, or rendered on those devices.
    if (prefersReducedMotion || isSmallViewport) return;

    // Defer mount a tick past first paint so the hero's text/LCP isn't
    // waiting on WebGL init.
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => setShouldRender3D(true))
        : setTimeout(() => setShouldRender3D(true), 200);
    return () => {
      if (typeof requestIdleCallback !== "undefined" && typeof id === "number") cancelIdleCallback(id);
      else clearTimeout(id as unknown as number);
    };
  }, []);

  if (!shouldRender3D) {
    // Lightweight CSS-only fallback: a soft drifting gradient mesh, no WebGL.
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-driftSlow rounded-full bg-chrome/20 blur-3xl" />
        <div
          className="absolute right-1/4 top-1/2 h-96 w-96 animate-driftSlow rounded-full bg-silver/10 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
      </div>
    );
  }

  return <Hero3D />;
}
