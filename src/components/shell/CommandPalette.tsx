"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { KeyCap } from "@/components/ui/KeyCap";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { commandGroups, commandsById, type CommandItem } from "./commands";
import { cn } from "@/lib/cn";

const RECENTS_KEY = "palette:recent";
const RECENTS_LIMIT = 4;
const EMPTY_TEXT = "Nothing by that name. Try 'canvas' or 'consulting'.";

function readRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeRecents(ids: string[]): void {
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(ids.slice(0, RECENTS_LIMIT)));
  } catch {
    // localStorage unavailable (private mode, disabled) — recents just don't persist.
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}

interface PaletteRowProps {
  item: CommandItem;
  onSelect: () => void;
}

function PaletteRow({ item, onSelect }: PaletteRowProps) {
  return (
    <Command.Item
      value={item.label}
      keywords={item.keywords}
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-2 px-3 py-2 text-sm text-fg-2",
        "data-[selected=true]:bg-sunken data-[selected=true]:text-fg",
      )}
    >
      <span>{item.label}</span>
      {item.shortcut && <KeyCap className="ml-auto">{item.shortcut}</KeyCap>}
    </Command.Item>
  );
}

/**
 * Global command palette (cmdk in a Radix dialog): opened via ⌘K / Ctrl+K /
 * "/" (ignored while typing in a field), or the watch Crown's `press`,
 * which dispatches a `palette:open` window event rather than taking a
 * prop — keeps the palette a single, self-contained instance mounted once
 * in `Header` with no state lifted for it.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recents, setRecents] = useState<string[]>([]);
  const router = useRouter();
  const { setTheme } = useTheme();
  const previousFocus = useRef<HTMLElement | null>(null);

  // Side effects tied to an open/close transition live in the event
  // handlers that cause the transition (below), not in a `useEffect`
  // reacting to `open` — an effect that calls `setState` synchronously on
  // every render of a changed dependency just re-triggers the render it
  // was reacting to.
  const openPalette = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    track("palette_open");
    setRecents(readRecents());
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setSearch("");
    setOpen(false);
    previousFocus.current?.focus();
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) openPalette();
      else closePalette();
    },
    [openPalette, closePalette],
  );

  useEffect(() => {
    window.addEventListener("palette:open", openPalette);
    return () => window.removeEventListener("palette:open", openPalette);
  }, [openPalette]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/";
      if (!isModK && !isSlash) return;

      event.preventDefault();
      if (open) closePalette();
      else openPalette();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, closePalette]);

  const recentItems = useMemo(
    () =>
      recents
        .map((id) => commandsById.get(id))
        .filter((item): item is CommandItem => Boolean(item)),
    [recents],
  );

  function runCommand(item: CommandItem) {
    track("palette_command", { id: item.id });

    const nextRecents = [item.id, ...recents.filter((id) => id !== item.id)].slice(
      0,
      RECENTS_LIMIT,
    );
    setRecents(nextRecents);
    writeRecents(nextRecents);

    switch (item.action.kind) {
      case "navigate":
        router.push(item.action.href as Parameters<typeof router.push>[0]);
        break;
      case "external":
        window.open(item.action.href, "_blank", "noopener,noreferrer");
        break;
      case "mailto":
        window.location.assign(item.action.href);
        break;
      case "copy-email":
        navigator.clipboard?.writeText(site.email).catch(() => {});
        track("email_copy");
        break;
      case "theme":
        setTheme(item.action.theme);
        break;
    }

    closePalette();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={handleOpenChange}
      label="Command menu"
      shouldFilter
      overlayClassName="fixed inset-0 z-[var(--z-palette)] bg-black/50"
      contentClassName="glass fixed left-1/2 top-[16vh] z-[var(--z-palette)] w-[min(560px,92vw)] -translate-x-1/2 overflow-hidden rounded-4"
    >
      <div onPointerMove={handlePointerMove} className="relative">
        <span
          aria-hidden="true"
          className="palette-specular pointer-events-none absolute inset-0"
        />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Jump to a page, project, or action…"
          className="w-full border-b border-line bg-transparent px-4 py-3 font-sans text-sm text-fg outline-none placeholder:text-fg-3"
        />
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-fg-3">
            {EMPTY_TEXT}
          </Command.Empty>

          {recentItems.length > 0 && (
            <Command.Group
              heading="Recent"
              className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-fg-3"
            >
              {recentItems.map((item) => (
                <PaletteRow
                  key={`recent-${item.id}`}
                  item={item}
                  onSelect={() => runCommand(item)}
                />
              ))}
            </Command.Group>
          )}

          {commandGroups.map((group) => (
            <Command.Group
              key={group.name}
              heading={group.name}
              className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-fg-3"
            >
              {group.items.map((item) => (
                <PaletteRow key={item.id} item={item} onSelect={() => runCommand(item)} />
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
