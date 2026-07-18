"use client";

import { useEffect, useRef } from "react";

export function HeroScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    function onMove(e: MouseEvent) {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    }

    function tick() {
      // Eased follow, not 1:1 tracking — reads as cinematic drift rather
      // than a jittery cursor-locked effect, and is cheap (no libraries).
      curX += (targetX - curX) * 0.04;
      curY += (targetY - curY) * 0.04;
      if (layer1.current) layer1.current.style.transform = `translate3d(${curX * 40}px, ${curY * 24}px, 0)`;
      if (layer2.current) layer2.current.style.transform = `translate3d(${curX * -70}px, ${curY * -40}px, 0)`;
      if (layer3.current) layer3.current.style.transform = `translate3d(${curX * 22}px, ${curY * 55}px, 0)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden">
      {/* Depth layers: far, mid, near — each drifts at a different rate for
          a parallax read without any 3D engine. */}
      <div ref={layer2} className="absolute -left-20 top-1/4 h-[28rem] w-[28rem] rounded-full bg-chrome-dim/25 blur-[100px] transition-transform duration-500 ease-out" />
      <div ref={layer1} className="absolute right-[-4rem] top-10 h-96 w-96 animate-driftSlow rounded-full bg-chrome/25 blur-[90px] transition-transform duration-500 ease-out" />
      <div
        ref={layer3}
        className="absolute bottom-[-6rem] left-1/3 h-[26rem] w-[26rem] animate-driftSlow rounded-full bg-silver/15 blur-[110px] transition-transform duration-500 ease-out"
        style={{ animationDelay: "-3.5s" }}
      />

      {/* Faint chrome grid — the "spec sheet under glass" texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8B93A6 1px, transparent 1px), linear-gradient(to bottom, #8B93A6 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
