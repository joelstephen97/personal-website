import { SectionHeader } from "@/components/ui/SectionHeader";
import { getNow } from "@/lib/content";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** `"2026-09"` -> `"September 2026"`. */
function formatUpdated(ym: string): string {
  const [year, month] = ym.split("-");
  const label = MONTHS[Number(month) - 1];
  return label ? `${label} ${year}` : ym;
}

/**
 * `getNow()` as a `<dl>`. Its `SectionHeader` uses `tone="muted"` and the
 * `<dt>` terms use `label text-fg-3` rather than champagne — this section
 * sits beside `ExperienceCompressed` in the same viewport, and that
 * section's `SectionHeader` eyebrow already spends the champagne budget
 * there.
 */
export function NowBlock() {
  const now = getNow();

  return (
    <div className="border-l border-champagne-line pl-6 lg:pl-9">
      <SectionHeader eyebrow="Now" title={formatUpdated(now.updated)} tone="muted" />
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="label text-fg-3">Building</dt>
          <dd className="mt-1 text-sm leading-relaxed text-fg-2">{now.building.join(". ")}.</dd>
        </div>
        <div>
          <dt className="label text-fg-3">Exploring</dt>
          <dd className="mt-1 text-sm leading-relaxed text-fg-2">{now.exploring.join(", ")}.</dd>
        </div>
        <div>
          <dt className="label text-fg-3">Reading</dt>
          <dd className="mt-1 text-sm leading-relaxed text-fg-2">{now.reading}</dd>
        </div>
        <div>
          <dt className="label text-fg-3">Away from the keyboard</dt>
          <dd className="mt-1 text-sm leading-relaxed text-fg-2">{now.away}</dd>
        </div>
      </dl>
    </div>
  );
}
