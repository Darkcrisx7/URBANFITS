import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[linear-gradient(110deg,#F2F2F2_8%,#E4E4E4_18%,#F2F2F2_33%)] bg-[length:200%_100%] animate-shimmer",
        className
      )}
    />
  );
}
