import { allWritings } from "content-collections";
import { domains } from "@/content/domains";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { lab } from "@/content/lab";
import { now } from "@/content/now";
import { principles } from "@/content/principles";
import { projects } from "@/content/projects";
import type { DomainId } from "@/content/schema";
import { services } from "@/content/services";

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getArchive() {
  return projects.filter((p) => p.category === "archive").sort((a, b) => a.order - b.order);
}

export function getExperience() {
  return experience;
}

export function getEducation() {
  return education;
}

export function getServices() {
  return services;
}

export function getDomains() {
  return domains;
}

export function getDomain(id: DomainId) {
  return domains.find((d) => d.id === id);
}

export function getNow() {
  return now;
}

export function getPrinciples() {
  return principles;
}

export function getLab() {
  return lab;
}

/** Published (non-draft) writing, in the generated content-collections order. */
export function getWriting() {
  return allWritings.filter((w) => !w.draft);
}

/** The Header/CommandPalette "Writing" nav item only appears once there's enough of it. */
export function hasWriting(): boolean {
  return getWriting().length >= 2;
}

export function deriveEdges(): { a: DomainId; b: DomainId; weight: number }[] {
  const edges: { a: DomainId; b: DomainId; weight: number }[] = [];
  for (let i = 0; i < domains.length; i++) {
    for (let j = i + 1; j < domains.length; j++) {
      const a = domains[i];
      const b = domains[j];
      if (!a || !b) continue;
      const shared = a.work.filter((slug) => b.work.includes(slug));
      if (shared.length > 0) {
        edges.push({ a: a.id, b: b.id, weight: shared.length });
      }
    }
  }
  return edges;
}
