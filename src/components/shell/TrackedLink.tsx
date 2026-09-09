"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { track, type AnalyticsEvent } from "@/lib/analytics";

// See Button.tsx for why this cast exists instead of a typed `href` prop.
type LinkHref = ComponentProps<typeof Link>["href"];

export interface TrackedLinkProps {
  href: string;
  external?: boolean;
  event: AnalyticsEvent;
  eventProps?: Record<string, string>;
  className?: string;
  children: ReactNode;
}

/**
 * A plain anchor (`next/link`, or a real `<a target="_blank">` when
 * `external`) that fires an analytics event on click. Exists so a server
 * component (`Footer`) can attach a click handler to a link without the
 * whole tree it lives in becoming a client component — only this leaf is.
 */
export function TrackedLink({
  href,
  external,
  event,
  eventProps,
  className,
  children,
}: TrackedLinkProps) {
  function handleClick() {
    track(event, eventProps);
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href as LinkHref} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export interface TrackedButtonProps extends Omit<ButtonProps, "onClick"> {
  event: AnalyticsEvent;
  eventProps?: Record<string, string>;
}

/** `Button`, wrapped with an analytics `onClick` — the CTA counterpart of `TrackedLink`. */
export function TrackedButton({ event, eventProps, ...rest }: TrackedButtonProps) {
  return <Button onClick={() => track(event, eventProps)} {...rest} />;
}
