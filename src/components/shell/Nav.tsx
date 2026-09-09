"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// See Button.tsx for why this cast exists instead of a typed `href` prop.
type LinkHref = ComponentProps<typeof Link>["href"];

export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/consulting", label: "Consulting" },
  { href: "/about", label: "About" },
];

export interface NavProps {
  className?: string;
}

/**
 * Desktop primary nav. Active-item indication is a 1.5px accent underline
 * driven by a CSS `scale-x` transition rather than a shared `m.span
 * layoutId` — `layoutId` needs Motion's `domMax` feature bundle, and the
 * app only loads `domAnimation` (see `MotionProvider`); CSS avoids the
 * extra ~15kB for a single hairline.
 */
export function Nav({ className }: NavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("hidden items-center gap-6 md:flex", className)}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false);
        return (
          <Link
            key={item.href}
            href={item.href as LinkHref}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-2 text-sm text-fg-2 transition-colors hover:text-fg",
              active && "text-fg",
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-px h-[1.5px] origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]",
                active && "scale-x-100",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
