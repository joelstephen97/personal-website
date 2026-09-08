import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TagTone = "default" | "champagne";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "className"> {
  children: ReactNode;
  dot?: boolean;
  tone?: TagTone;
  className?: string;
}

const toneClasses: Record<TagTone, string> = {
  default: "border-line text-fg-2",
  champagne: "border-champagne-line text-champagne",
};

const dotClasses: Record<TagTone, string> = {
  default: "bg-fg-3",
  champagne: "bg-champagne",
};

export function Tag({ children, dot, tone = "default", className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-1 border px-2 py-0.5 font-mono text-[11px]",
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotClasses[tone])} />}
      {children}
    </span>
  );
}
