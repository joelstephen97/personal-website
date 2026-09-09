import { RoleEntry, type CaseStudyLink } from "@/components/experience/RoleEntry";
import type { Experience } from "@/content/schema";

export interface ExperienceRailProps {
  roles: Experience[];
  /** Case-study links for the current (first) role only. */
  caseStudyLinks?: CaseStudyLink[];
  /** The "from public sources" note for the current (first) role only. */
  publicNote?: { text: string; href: string; linkLabel: string };
}

/**
 * A single `bg-line-2` vertical line running the height of the rail, with
 * one `RoleEntry` per role. The line's offset (`left-3` at 24px dot columns,
 * `md:left-[15px]` once the dot column widens to 30px) tracks the dot's
 * horizontal center at both breakpoints — see `RoleEntry`'s grid.
 */
export function ExperienceRail({ roles, caseStudyLinks, publicNote }: ExperienceRailProps) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-3 top-2 w-px bg-line-2 md:left-[15px]"
      />
      <ol className="space-y-10">
        {roles.map((role, index) => {
          const isCurrent = index === 0;
          return (
            <li key={role.id}>
              <RoleEntry
                role={role}
                isCurrent={isCurrent}
                caseStudyLinks={isCurrent ? caseStudyLinks : undefined}
                publicNote={isCurrent ? publicNote : undefined}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
