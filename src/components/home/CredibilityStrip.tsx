import { Fragment } from "react";
import { TextLink } from "@/components/ui/TextLink";
import { Tooltip } from "@/components/ui/Tooltip";
import { profile } from "@/content/profile";

/**
 * A row of `profile.credibility` items separated by 4px dots. The dots are
 * decorative and would normally read as champagne in the mockup, but stay
 * `bg-line-2` here to keep the hero viewport's champagne budget (status
 * line + bezel marker + core stroke) at three.
 */
export function CredibilityStrip() {
  return (
    <div className="border-b border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-9 gap-y-3 px-5 py-5 sm:px-8 lg:px-14">
        {profile.credibility.map((item, i) => {
          const content = (
            <span className="label text-fg-2">
              <b className="font-medium text-fg">{item.label}</b> · {item.detail}
            </span>
          );

          const trigger = item.href ? (
            <TextLink href={item.href} external className="no-underline">
              {content}
            </TextLink>
          ) : (
            content
          );

          return (
            <Fragment key={item.label}>
              {i > 0 && (
                <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-line-2" />
              )}
              {item.tip ? <Tooltip label={item.tip}>{trigger}</Tooltip> : trigger}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
