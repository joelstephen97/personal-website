import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getServices } from "@/lib/content";
import { consultingCopy } from "@/content/consulting-copy";
import { site } from "@/lib/site";
import { Guilloche } from "@/components/movement/Guilloche";
import { TrackedLink } from "@/components/shell/TrackedLink";
import { Button } from "@/components/ui/Button";
import { WhoFor } from "@/components/consulting/WhoFor";
import { NotFor } from "@/components/consulting/NotFor";
import { Roadmapping } from "@/components/consulting/Roadmapping";
import { Ladder } from "@/components/consulting/Ladder";
import { Proof } from "@/components/consulting/Proof";
import { Faq } from "@/components/consulting/Faq";
import { Cta } from "@/components/consulting/Cta";

export const metadata: Metadata = pageMetadata({
  title: "Consulting",
  description: consultingCopy.hero,
  path: "/consulting",
});

export default function ConsultingPage() {
  const services = getServices();
  const roadmapping = services.find((s) => s.id === "roadmapping-session")!;
  const ladderServices = services.filter((s) => s.slug !== null);
  const alsoAvailable = services.filter((s) => s.slug === null);

  return (
    <div>
      <JsonLd data={jsonLdGraph({ path: "/consulting", kind: "consulting" })} />

      {/* Hero. Champagne budget: the status line is the only champagne use
          in this viewport — the hero has no SectionHeader. */}
      <section className="relative overflow-hidden border-b border-line">
        <Guilloche className="pointer-events-none absolute inset-0" focus={[1400, 160]} />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="label text-champagne">A small number of engagements · remote · GMT+4</p>
          <h1 className="mt-5 text-balance font-display text-[clamp(2.75rem,1.6rem+4.4vw,3.75rem)] leading-[1.02]">
            You shipped an AI feature. Now it has to work in production.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-2">
            AI integration, workflow systems, and real-time collaboration for product teams. A small
            number of engagements alongside my role at AppliedAI. Remote, GMT+4. Fixed fees, never
            hourly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href={`mailto:${site.email}?subject=Roadmapping%20session`}
              event="consulting_cta_click"
              eventProps={{ location: "consulting-hero" }}
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

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <WhoFor />
        <Roadmapping service={roadmapping} />
        <Ladder services={ladderServices} alsoAvailable={alsoAvailable} />
        <NotFor />
        <Proof />
        <Faq />
        <Cta location="consulting-footer" />
      </div>
    </div>
  );
}
