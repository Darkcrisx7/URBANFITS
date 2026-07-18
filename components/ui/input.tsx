import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] px-4 text-sm text-[color:var(--c-ink)] outline-none transition-colors placeholder:text-[color:var(--c-muted)] focus:border-[color:var(--c-ink)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-[color:var(--c-border)] bg-[color:var(--c-surface)] px-4 py-3 text-sm text-[color:var(--c-ink)] outline-none transition-colors placeholder:text-[color:var(--c-muted)] focus:border-[color:var(--c-ink)]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium uppercase tracking-wideish text-[color:var(--c-label)]"
    >
      {children}
    </label>
  );
}
