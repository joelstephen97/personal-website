import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface KeyCapProps extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  children: ReactNode;
  className?: string;
}

/** Mac-style key cap: 1px border, thicker 2px bottom edge. */
export function KeyCap({ children, className, ...rest }: KeyCapProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-[1.5em] items-center justify-center rounded-2 border border-line-2 border-b-2 bg-sunken px-1.5 py-0.5 font-mono text-[11px] text-fg-2",
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}
