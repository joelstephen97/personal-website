import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { getLab } from "@/lib/content";

/**
 * Three tier-1 lab entries as window-chrome tiles: a title bar with three
 * inert lights and the slug, a placeholder body, and a caption. Links to
 * `/lab`. The title bar uses `.glass` — lab window title bars are one of
 * the constraints' explicitly-allowed glass surfaces.
 */
export function LabTeaser() {
  const entries = getLab()
    .filter((entry) => entry.tier === 1)
    .slice(0, 3);

  return (
    <div>
      <SectionHeader eyebrow="Lab" title="Things built to understand something." />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={entry.slug}
            className="overflow-hidden rounded-[var(--radius-3)] border border-line-2 bg-raised"
          >
            <div className="glass flex items-center gap-2 px-3 py-2 font-mono text-[11.5px] text-fg-3">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="size-[9px] rounded-full bg-error/80" />
                <span className="size-[9px] rounded-full bg-warning/80" />
                <span className="size-[9px] rounded-full bg-success/80" />
              </span>
              <span>{entry.slug}.lab</span>
            </div>
            <div
              aria-hidden="true"
              className="grid h-[120px] place-items-center font-mono text-xs text-fg-3"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--surface-raised) 0 4px, var(--surface-sunken) 4px 6px)",
              }}
            >
              planned — not yet built
            </div>
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-fg">{entry.title}</p>
              <p className="mt-0.5 text-xs text-fg-3">{entry.blurb}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <TextLink href="/lab">All fourteen →</TextLink>
      </div>
    </div>
  );
}
