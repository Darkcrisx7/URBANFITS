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
              i < Math.round(value) ? "fill-ink text-ink" : "fill-stone-200 text-stone-200"
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-stone-500">({count})</span>
      )}
    </div>
  );
}
