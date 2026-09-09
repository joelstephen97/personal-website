"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "./TransitionLink";
import { cn } from "@/lib/cn";

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

const WRITING_ITEM: NavItem = { href: "/writing", label: "Writing" };

/**
 * The base four nav items, plus "Writing" when `showWriting` (from
 * `hasWriting()`, computed server-side in `layout.tsx` and prop-drilled
 * down — the writing collection itself is never imported into client
 * code). Shared by `Nav` and `MobileSheet` so desktop and mobile nav stay
 * in sync.
 */
export function getNavItems(showWriting: boolean): NavItem[] {
  return showWriting ? [...NAV_ITEMS, WRITING_ITEM] : NAV_ITEMS;
}

export interface NavProps {
  showWriting?: boolean;
  className?: string;
}

/**
 * Desktop primary nav. Active-item indication is a 1.5px accent underline
 * driven by a CSS `scale-x` transition rather than a shared `m.span
 * layoutId` — `layoutId` needs Motion's `domMax` feature bundle, and the
 * app only loads `domAnimation` (see `MotionProvider`); CSS avoids the
 * extra ~15kB for a single hairline.
 */
export function Nav({ showWriting = false, className }: NavProps) {
  const pathname = usePathname();
  const items = getNavItems(showWriting);

  return (
    <nav aria-label="Primary" className={cn("hidden items-center gap-6 md:flex", className)}>
      {items.map((item) => {
        const active = pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false);
        return (
          <TransitionLink
            key={item.href}
            href={item.href}
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
          </TransitionLink>
        );
      })}
    </nav>
  );
}
