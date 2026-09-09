import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { site } from "@/lib/site";

export interface CtaProps {
  /** `consulting_cta_click`'s `location` prop — distinguishes hero/footer/service CTAs. */
  location: string;
}

/** The closing champagne-line bordered CTA card. */
export function Cta({ location }: CtaProps) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="rounded-4 border border-champagne-line bg-raised p-8 sm:p-10">
        <h2 className="font-display text-2xl text-fg">Book a roadmapping session</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-2">
          Ninety minutes on your product and a written plan within two days. Two working days to
          reply to email, and if it isn&apos;t a fit I&apos;ll say so and point you somewhere
          better.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <TrackedLink
            href={`mailto:${site.email}?subject=Roadmapping%20session`}
            event="consulting_cta_click"
            eventProps={{ location }}
            className="inline-flex h-12 items-center rounded-3 bg-accent px-5 text-base font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Book a roadmapping session
          </TrackedLink>
          <Button href={`mailto:${site.email}`} external variant="ghost" size="lg">
            Or write to me →
          </Button>
        </div>
      </div>
    </section>
  );
}
