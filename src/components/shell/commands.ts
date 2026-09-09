import { site } from "@/lib/site";

export type CommandGroupName = "Navigate" | "Work" | "Actions";

export type CommandAction =
  | { kind: "navigate"; href: string }
  | { kind: "external"; href: string }
  | { kind: "mailto"; href: string }
  | { kind: "copy-email" }
  | { kind: "theme"; theme: "dark" | "light" | "system" };

export interface CommandItem {
  id: string;
  label: string;
  action: CommandAction;
  keywords?: string[];
  shortcut?: string;
}

export interface CommandGroup {
  name: CommandGroupName;
  items: CommandItem[];
}

const RESUME_HREF = "/joel-stephen-resume.pdf";
const SCAMSHIELD_HREF = "https://chromewebstore.google.com/detail/fojjjofjimbfoddafoampojopijnlihl";

// Static: the five featured case studies (mirrors `getFeaturedProjects()`
// order in `src/content/projects.ts`) kept as literals here rather than
// imported, so the command palette's client bundle doesn't pull in the
// zod-validated content module.
export const commandGroups: CommandGroup[] = [
  {
    name: "Navigate",
    items: [
      { id: "nav-work", label: "Work", action: { kind: "navigate", href: "/work" } },
      {
        id: "nav-experience",
        label: "Experience",
        action: { kind: "navigate", href: "/experience" },
      },
      {
        id: "nav-consulting",
        label: "Consulting",
        action: { kind: "navigate", href: "/consulting" },
      },
      { id: "nav-about", label: "About", action: { kind: "navigate", href: "/about" } },
      { id: "nav-resume", label: "Résumé", action: { kind: "external", href: RESUME_HREF } },
      {
        id: "nav-contact",
        label: "Contact",
        action: { kind: "mailto", href: `mailto:${site.email}` },
      },
      { id: "nav-now", label: "Now", action: { kind: "navigate", href: "/now" } },
    ],
  },
  {
    name: "Work",
    items: [
      {
        id: "work-process-discovery",
        label: "Process Discovery",
        action: { kind: "navigate", href: "/work/process-discovery" },
      },
      {
        id: "work-workflow-canvas",
        label: "Opus workflow-builder canvas",
        action: { kind: "navigate", href: "/work/workflow-canvas" },
      },
      {
        id: "work-scamshield",
        label: "ScamShield",
        action: { kind: "navigate", href: "/work/scamshield" },
      },
      {
        id: "work-flower-meister",
        label: "Flower Meister",
        action: { kind: "navigate", href: "/work/flower-meister" },
      },
      {
        id: "work-fmi",
        label: "FMI",
        action: { kind: "navigate", href: "/work/fmi-platform" },
      },
    ],
  },
  {
    name: "Actions",
    items: [
      {
        id: "action-copy-email",
        label: "Copy email",
        action: { kind: "copy-email" },
        keywords: [site.email],
      },
      {
        id: "action-github",
        label: "Open GitHub",
        action: { kind: "external", href: site.github },
      },
      {
        id: "action-linkedin",
        label: "Open LinkedIn",
        action: { kind: "external", href: site.linkedin },
      },
      {
        id: "action-resume-download",
        label: "Download résumé",
        action: { kind: "external", href: RESUME_HREF },
      },
      {
        id: "action-install-scamshield",
        label: "Install ScamShield",
        action: { kind: "external", href: SCAMSHIELD_HREF },
      },
      { id: "action-theme-dark", label: "Theme: Dark", action: { kind: "theme", theme: "dark" } },
      {
        id: "action-theme-light",
        label: "Theme: Light",
        action: { kind: "theme", theme: "light" },
      },
      {
        id: "action-theme-system",
        label: "Theme: System",
        action: { kind: "theme", theme: "system" },
      },
      {
        id: "action-discuss-project",
        label: "Discuss a project",
        action: { kind: "mailto", href: `mailto:${site.email}?subject=Project:%20` },
      },
    ],
  },
];

// Gated the same way as the Header/Nav "Writing" link (see
// `hasWriting()` in `src/lib/content.ts`) — kept out of `commandGroups`
// itself so a stale `palette:recent` id from before the gate flipped off
// still resolves via `commandsById`.
export const WRITING_COMMAND: CommandItem = {
  id: "nav-writing",
  label: "Writing",
  action: { kind: "navigate", href: "/writing" },
};

/** The Navigate group's items, with "Writing" appended when it's gated on. */
export function navigateItemsWithWriting(showWriting: boolean): CommandItem[] {
  const navigate = commandGroups.find((group) => group.name === "Navigate")?.items ?? [];
  return showWriting ? [...navigate, WRITING_COMMAND] : navigate;
}

export const allCommands: CommandItem[] = [
  ...commandGroups.flatMap((group) => group.items),
  WRITING_COMMAND,
];
export const commandsById: Map<string, CommandItem> = new Map(
  allCommands.map((item) => [item.id, item]),
);
