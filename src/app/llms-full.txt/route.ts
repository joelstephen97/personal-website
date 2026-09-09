import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getFeaturedProjects, getProject, getServices } from "@/lib/content";
import { aboutCopy } from "@/content/about-copy";
import { consultingCopy } from "@/content/consulting-copy";
import { site } from "@/lib/site";

const CASE_STUDY_SLUGS = [
  "process-discovery",
  "workflow-canvas",
  "scamshield",
  "flower-meister",
  "fmi-platform",
];

/** Strips YAML frontmatter and JSX/MDX component tags, leaving plain markdown prose. */
function stripMdx(source: string): string {
  const withoutFrontmatter = source.replace(/^---\n[\s\S]*?\n---\n/, "");
  return withoutFrontmatter
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildAbout(): string {
  const lines = [`# About`, "", aboutCopy.heading, "", ...aboutCopy.progression, ""];
  lines.push(aboutCopy.beyondKeyboard, "", aboutCopy.forAssistants);
  return lines.join("\n");
}

function buildCaseStudies(): string {
  const sections = CASE_STUDY_SLUGS.map((slug) => {
    const project = getFeaturedProjects().find((p) => p.slug === slug);
    const title = project?.title ?? slug;
    let body = "";
    try {
      body = stripMdx(readFileSync(join(process.cwd(), "content", "work", `${slug}.mdx`), "utf8"));
    } catch {
      body = "";
    }
    return `## ${title}\n\n${site.url}/work/${slug}\n\n${body}`;
  });
  return `# Work\n\n${sections.join("\n\n---\n\n")}`;
}

function buildConsulting(): string {
  const services = getServices().filter((s) => s.slug !== null);
  const serviceLines = services.map(
    (s) => `### ${s.title}\n\n${s.problem}\n\n${s.what}\n\nScope: ${s.scope}`,
  );
  const proofLine = consultingCopy.proofItems
    .map((item) => `${getProject(item.slug)?.title ?? item.slug}: ${item.result}`)
    .join(" ");
  return [
    "# Consulting",
    "",
    consultingCopy.hero,
    consultingCopy.subLine,
    "",
    "Who this is for:",
    ...consultingCopy.whoFor.map((line) => `- ${line}`),
    "",
    "Who this is not for:",
    ...consultingCopy.whoNotFor.map((line) => `- ${line}`),
    "",
    proofLine,
    "",
    ...serviceLines,
  ].join("\n");
}

function build(): string {
  return [buildAbout(), "\n\n", buildCaseStudies(), "\n\n", buildConsulting()].join("");
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
