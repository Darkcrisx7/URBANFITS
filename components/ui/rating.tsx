import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i < Math.round(value)
                ? "fill-[color:var(--c-ink)] text-[color:var(--c-ink)]"
                : "fill-[color:var(--c-hover-surface)] text-[color:var(--c-hover-surface)]"
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-[color:var(--c-label)]">({count})</span>
      )}
    </div>
  );
}
