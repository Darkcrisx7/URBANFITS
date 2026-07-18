"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
}: {
  images: { gradient: string; label: string; url?: string }[];
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <motion.div
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br cursor-zoom-in",
          images[active].gradient
        )}
      >
        {images[active].url && (
          <motion.img
            src={images[active].url}
            alt={images[active].label}
            animate={{ scale: zoomed ? 1.15 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!images[active].url && (
          <motion.div
            animate={{ scale: zoomed ? 1.15 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-end p-6"
          >
            <span className="font-display text-lg text-white/80">{images[active].label}</span>
          </motion.div>
        )}
      </motion.div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br transition-all",
                img.gradient,
                active === i ? "ring-2 ring-bone ring-offset-2" : "opacity-60 hover:opacity-100"
              )}
              aria-label={`View ${img.label}`}
            >
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.label} className="absolute inset-0 h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
