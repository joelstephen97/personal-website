import { getFeaturedProjects, getServices } from "@/lib/content";
import { profile } from "@/content/profile";
import { site } from "@/lib/site";

function build(): string {
  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${profile.oneLine}`);
  lines.push("");
  lines.push(profile.proof);
  lines.push("");

  lines.push("## Work");
  lines.push("");
  for (const project of getFeaturedProjects()) {
    lines.push(`- [${project.title}](${site.url}/work/${project.slug}): ${project.tagline}`);
  }
  lines.push("");

  lines.push("## Consulting");
  lines.push("");
  for (const service of getServices().filter((s) => s.slug !== null)) {
    lines.push(`- [${service.title}](${site.url}/consulting/${service.slug}): ${service.problem}`);
  }
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(`- [About](${site.url}/about)`);
  lines.push(`- [Contact](${site.url}/contact)`);
  lines.push(`- [Résumé](${site.url}/resume)`);
  lines.push(`- [Now](${site.url}/now)`);
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
