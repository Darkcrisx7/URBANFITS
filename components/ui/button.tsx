import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--c-accent)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--c-ink)] text-[color:var(--c-inverse)] hover:bg-[color:var(--c-hover-ink)] active:scale-[0.98]",
        secondary:
          "bg-[color:var(--c-surface)] text-[color:var(--c-ink)] border border-[color:var(--c-border)] hover:border-[color:var(--c-ink)] active:scale-[0.98]",
        accent: "bg-accent text-white hover:bg-accent-dim active:scale-[0.98]",
        ghost: "text-[color:var(--c-ink)] hover:bg-[color:var(--c-hover-surface)]",
        outline:
          "border border-[color:var(--c-ink)] text-[color:var(--c-ink)] hover:bg-[color:var(--c-ink)] hover:text-[color:var(--c-inverse)]",
        destructive: "bg-error text-white hover:bg-red-600",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
