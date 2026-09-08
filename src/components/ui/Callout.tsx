import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CalloutTone = "note" | "confidential" | "result" | "warning";

export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "title"> {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const ruleClasses: Record<CalloutTone, string> = {
  note: "border-accent",
  confidential: "border-champagne",
  result: "border-success",
  warning: "border-warning",
};

export function Callout({ tone = "note", title, children, className, ...rest }: CalloutProps) {
  return (
    <div
      className={cn(
        "border-l-[3px] rounded-2 bg-raised py-2 pl-4 pr-3",
        ruleClasses[tone],
        className,
      )}
      {...rest}
    >
      {title && <p className="mb-1 text-sm font-medium text-fg">{title}</p>}
      <div className="text-sm leading-relaxed text-fg-2">{children}</div>
    </div>
  );
}
