import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/home/Hero";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WorkCard } from "@/components/home/WorkCard";
import { Domains } from "@/components/home/Domains";
import { ExperienceCompressed } from "@/components/home/ExperienceCompressed";
import { NowBlock } from "@/components/home/NowBlock";
import { ConsultingBlock } from "@/components/home/ConsultingBlock";
import { ContactBlock } from "@/components/home/ContactBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { profile } from "@/content/profile";
import { getDomains, getFeaturedProjects } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.title}, Abu Dhabi`,
  description: profile.proof,
  path: "/",
});

// Section rhythm shared by every below-the-fold section (Hero and
// CredibilityStrip use their own tighter, hero-specific padding).
const SECTION = "mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24";

export default function Home() {
  const featured = getFeaturedProjects();
  const domainSummaries = getDomains().map(({ id, label }) => ({ id, label }));

  return (
    <>
      <JsonLd data={jsonLdGraph({ path: "/", kind: "home" })} />

      <Hero />
      <CredibilityStrip />

      <Reveal as="section" className={SECTION}>
        <Suspense
          fallback={
            <ul className="mt-10 grid gap-6">
              {featured.map((project, index) => (
                <li key={project.slug}>
                  <WorkCard project={project} flagship={index === 0} index={index} />
                </li>
              ))}
            </ul>
          }
        >
          <FeaturedWork projects={featured} domains={domainSummaries} />
        </Suspense>
      </Reveal>

      <Reveal as="section" className={SECTION}>
        <Domains />
      </Reveal>

      <Reveal as="section" className={`${SECTION} lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-12`}>
        <ExperienceCompressed />
        <div className="mt-14 lg:mt-0">
          <NowBlock />
        </div>
      </Reveal>

      <Reveal as="section" className={SECTION}>
        <ConsultingBlock />
      </Reveal>

      <Reveal as="section" className={SECTION}>
        <ContactBlock />
      </Reveal>
    </>
  );
}
