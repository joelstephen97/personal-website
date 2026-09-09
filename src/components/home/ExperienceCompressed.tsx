import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { getExperience } from "@/lib/content";
import { cn } from "@/lib/cn";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `"2025-06"` -> `"Jun 2025"`. */
function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const label = MONTHS[Number(month) - 1];
  return label ? `${label} ${year}` : ym;
}

/**
 * Five roles from `getExperience()` on a left rail, current role expanded
 * with its two-sentence summary. The current row's dot uses `bg-accent`
 * (not champagne) since this section shares a viewport with `NowBlock`,
 * whose own `SectionHeader` eyebrow already spends the champagne budget.
 */
export function ExperienceCompressed() {
  const experience = getExperience();

  return (
    <div>
      <SectionHeader eyebrow="Experience" title="Intern to AI and full-stack engineer." />
      <div className="relative mt-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line-2">
        {experience.map((role, index) => {
          const isCurrent = index === 0;
          return (
            <div key={role.id} className="relative grid grid-cols-[16px_1fr] gap-3 py-4">
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-[1] mt-[7px] size-[9px] rounded-full border-[1.5px]",
                  isCurrent ? "border-accent bg-accent" : "border-line-2 bg-ground",
                )}
              />
              {/* A single grid child (not two siblings) so the outer grid
                  stays a fixed [dot, content] pair at every breakpoint —
                  splitting date and role/company into separate top-level
                  grid items with a mobile-only 2-column template made the
                  3rd item auto-place into the 16px dot column, wrapping
                  every word in the role title onto its own line. */}
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <p className="shrink-0 font-mono text-[11.5px] leading-relaxed text-fg-3 sm:w-[140px]">
                  {formatMonth(role.dates.start)} –{" "}
                  {role.dates.end ? formatMonth(role.dates.end) : "present"}
                </p>
                <div>
                  <h3 className="text-[15px] font-semibold text-fg">{role.role}</h3>
                  <p className="text-sm text-fg-2">{role.company}</p>
                  {isCurrent && (
                    <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-fg-2">
                      {role.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <TextLink href="/experience">Full timeline →</TextLink>
      </div>
    </div>
  );
}
