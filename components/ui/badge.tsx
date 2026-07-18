import { cn } from "@/lib/utils";

const tones = {
  ink: "bg-[color:var(--c-ink)] text-[color:var(--c-inverse)]",
  accent: "bg-[color:var(--c-accent)] text-[color:var(--c-accent-ink)]",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  neutral: "bg-[color:var(--c-hover-surface)] text-[color:var(--c-label)]",
  outline: "border border-[color:var(--c-ink)] text-[color:var(--c-ink)]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wideish",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
