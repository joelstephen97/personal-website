import Image from "next/image";
import type { Project } from "@/content/schema";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";
import { WorkVisual } from "./work-visuals";

export interface WorkCardProps {
  project: Project;
  /** The lead card in the list: wider visual, swapped to the right. */
  flagship?: boolean;
  index: number;
}

// h3 fluid size from the type scale (not yet promoted to a theme token —
// see the identical inline pattern in SectionHeader.tsx).
const H3_SIZE = "text-[clamp(1.375rem,1.2rem+.6vw,1.875rem)] leading-[1.1]";

/**
 * Presentational, directive-free so it can render from `FeaturedWork`
 * ("use client") without pulling in server-only content helpers itself.
 */
export function WorkCard({ project, flagship = false, index }: WorkCardProps) {
  const { slug, title, tagline, technologies, company, dates } = project;

  return (
    <article
      aria-label={`Case study ${index + 1}: ${title}`}
      {...(flagship ? { "data-flagship": true } : {})}
      className={cn(
        "group grid gap-0 overflow-hidden rounded-[var(--radius-4)] border border-line bg-raised md:grid-cols-12",
        "transition-[transform,border-color] duration-[320ms] ease-[var(--ease-out-expo)] hover:-translate-y-[3px] hover:border-line-2 motion-reduce:transform-none",
      )}
    >
      <div
        className={cn(
          "relative min-h-[220px] bg-ground md:col-span-5 md:min-h-0",
          flagship && "md:order-2 md:col-span-7",
        )}
      >
        {slug === "scamshield" ? (
          <Image
            src="/work/scamshield/07.png"
            alt="ScamShield block page"
            fill
            sizes="(min-width:768px) 40vw, 100vw"
            className="object-cover"
          />
        ) : (
          <WorkVisual slug={slug} />
        )}
      </div>

      <div
        className={cn(
          "flex flex-col justify-center gap-3 p-[28px] sm:p-[30px] md:col-span-7",
          flagship && "md:col-span-5",
        )}
      >
        <p className="label text-fg-3">
          {company ?? "Independent"} · {dates.start} – {dates.end ?? "present"}
        </p>
        <h3 className={cn("font-display", H3_SIZE)}>
          <TransitionLink href={`/work/${slug}`} className="transition-colors hover:text-accent">
            {title}
          </TransitionLink>
        </h3>
        <p className="text-fg-2">{tagline}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 6).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        <TextLink href={`/work/${slug}`} className="mt-1 inline-flex w-fit items-center gap-1">
          Read the case study
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-[320ms] ease-[var(--ease-out-expo)] group-hover:translate-x-1"
          >
            →
          </span>
        </TextLink>
      </div>
    </article>
  );
}
