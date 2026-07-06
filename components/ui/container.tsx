import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-5 md:px-10", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest2 text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl font-medium tracking-tightest text-ink md:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
