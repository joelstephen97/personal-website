import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { RoleMore } from "@/components/experience/RoleMore";
import { cn } from "@/lib/cn";
import type { Experience } from "@/content/schema";

export interface CaseStudyLink {
  slug: string;
  title: string;
}

export interface RoleEntryProps {
  role: Experience;
  isCurrent: boolean;
  /** AppliedAI only: case-study links resolved server-side via `getProject`. */
  caseStudyLinks?: CaseStudyLink[];
  /** AppliedAI only: the public-sources paragraph, with its source link. */
  publicNote?: { text: string; href: string; linkLabel: string };
}

const IMPACT_LINES: Record<Experience["depth"], number | "all"> = {
  full: "all",
  "60": 4,
  "40": 3,
  "25": 2,
  "15": 1,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `"2025-06"` -> `"Jun 2025"`. */
function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const label = MONTHS[Number(month) - 1];
  return label ? `${label} ${year}` : ym;
}

/**
 * One role on the experience rail: a dot (col 1), the dates + location
 * (col 2), and the role's content (col 3) in a
 * `grid-cols-[30px_190px_1fr]` layout that collapses to a single stacked
 * column under `md` — the "when" block stays a direct grid child via
 * `md:contents` so it lands in its own column only once there's room.
 */
export function RoleEntry({ role, isCurrent, caseStudyLinks, publicNote }: RoleEntryProps) {
  const count = IMPACT_LINES[role.depth];
  const visibleImpact = count === "all" ? role.impact : role.impact.slice(0, count);
  const restImpact = count === "all" ? [] : role.impact.slice(count);

  return (
    <div className="relative grid grid-cols-[24px_1fr] gap-x-3 md:grid-cols-[30px_190px_1fr] md:gap-x-6">
      <div className="flex justify-center pt-[5px]">
        <span
          aria-hidden="true"
          className={cn(
            "relative z-[1] size-[9px] rounded-full border-[1.5px]",
            isCurrent ? "border-champagne bg-champagne" : "border-line-2 bg-ground",
          )}
        />
      </div>
      <div className="flex flex-col gap-1 md:contents">
        <div className="font-mono text-[12px] leading-relaxed text-fg-3">
          <p>
            {formatMonth(role.dates.start)} –{" "}
            {role.dates.end ? formatMonth(role.dates.end) : "present"}
          </p>
          <p>{role.location}</p>
        </div>
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold text-fg">{role.role}</h2>
          <p className="text-sm text-fg-2">{role.company}</p>
          <p className="mt-3 text-base leading-relaxed text-fg-2">{role.summary}</p>

          {visibleImpact.length > 0 && (
            <ul className="mt-4 list-disc space-y-1.5 pl-5">
              {visibleImpact.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-fg-2">
                  {line}
                </li>
              ))}
            </ul>
          )}

          <RoleMore items={restImpact} />

          {role.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {role.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          )}

          {role.lessons.length > 0 && (
            <p className="mt-4 text-sm leading-relaxed text-fg-2">
              <b className="font-semibold text-fg">Engineering lessons.</b> {role.lessons.join(" ")}
            </p>
          )}

          {caseStudyLinks && caseStudyLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {caseStudyLinks.map((link) => (
                <TextLink key={link.slug} href={`/work/${link.slug}`}>
                  {link.title} →
                </TextLink>
              ))}
            </div>
          )}

          {publicNote && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="label text-fg-3">AppliedAI, from public sources</p>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-2">{publicNote.text}</p>
              <p className="mt-2">
                <TextLink href={publicNote.href} external>
                  {publicNote.linkLabel}
                </TextLink>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
