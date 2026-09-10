import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// See Button.tsx for why this cast exists instead of a typed `href` prop.
type LinkHref = ComponentProps<typeof Link>["href"];

export interface TextLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
> {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

/** Inline link with a drawn underline (see `.link-draw` in globals.css). */
export function TextLink({ href, external, className, children, ...rest }: TextLinkProps) {
  const classes = cn("link-draw text-link", className);

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...rest}>
        {children}
        <span aria-hidden="true">{" ↗"}</span>
      </a>
    );
  }

  return (
    <Link href={href as LinkHref} className={classes} {...rest}>
      {children}
    </Link>
  );
}
