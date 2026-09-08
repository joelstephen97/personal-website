import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTag = "div" | "article" | "section";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  as?: CardTag;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ as = "div", interactive, className, children, ...rest }: CardProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "border border-line bg-raised rounded-4",
        interactive &&
          "transition-[transform,border-color] duration-[320ms] ease-[var(--ease-out-expo)] hover:-translate-y-[3px] hover:border-line-2 motion-reduce:transform-none",
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
