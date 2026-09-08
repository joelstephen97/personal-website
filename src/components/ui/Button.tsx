import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// `href` stays a plain `string` on the public prop type below; this is only
// used to cast into whatever `next/link`'s (typedRoutes-augmented) `href`
// prop actually expects at the one place it is handed to `Link`.
type LinkHref = ComponentProps<typeof Link>["href"];

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

const baseClasses =
  "inline-flex items-center gap-2 rounded-[var(--radius-3)] font-sans font-medium transition-colors focus-visible:outline-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-line-2 text-fg hover:border-line-3 bg-raised",
  ghost: "text-fg-2 hover:text-fg hover:bg-sunken",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

/**
 * Renders an `<a>` (next/link `Link` for internal, plain anchor when
 * `external`) whenever `href` is given, otherwise a `<button>`.
 *
 * `href` is kept as a plain `string` on the public prop type (the caller
 * never has to fight `typedRoutes`), and cast to `Link`'s own `href` type
 * only where it is handed to `Link` internally.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  type,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    const anchorRest = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href as LinkHref} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
