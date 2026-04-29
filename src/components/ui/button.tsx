import * as React from "react";
import Link from "next/link";
import { focusRing } from "@/lib/style";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "peacock";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60",
  secondary:
    "border border-border text-foreground/80 hover:border-foreground/40 hover:text-foreground",
  tertiary:
    "border border-border bg-background text-foreground/80 hover:border-foreground/40 hover:text-foreground",
  ghost: "text-foreground/80 hover:text-foreground",
  peacock:
    "bg-bead-blue text-pearl shadow-sm hover:bg-bead-blue/90 disabled:opacity-60",
};

const SIZES: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  sm: "h-8 px-3 text-xs",
};

const BASE = cn(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed",
  focusRing,
);

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
