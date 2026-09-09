"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("./CommandPalette").then((mod) => mod.CommandPalette));

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}

export interface PaletteLauncherProps {
  showWriting?: boolean;
}

/**
 * Mounted eagerly in `Header` (on every route) so the ⌘K / Ctrl+K / "/"
 * shortcut and the Crown's `palette:open` event stay responsive from
 * first paint, without shipping `cmdk` — and the rest of `CommandPalette`
 * — in the route's initial JS. This listener is intentionally tiny and
 * lives outside the lazily-loaded chunk (unlike an earlier rejected
 * design where the listener itself was inside the lazy component, which
 * made the shortcut do nothing until the chunk had already loaded once
 * some other way). The first trigger starts the dynamic import and mounts
 * the real palette already open (`initialOpen`); from that point on,
 * `CommandPalette`'s own keydown listener takes over for the rest of the
 * session, so this component stops listening once `loaded` flips.
 */
export function PaletteLauncher({ showWriting = false }: PaletteLauncherProps) {
  const [loaded, setLoaded] = useState(false);

  const trigger = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (loaded) return;

    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/";
      if (!isModK && !isSlash) return;
      event.preventDefault();
      trigger();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("palette:open", trigger);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("palette:open", trigger);
    };
  }, [loaded, trigger]);

  if (!loaded) return null;

  return <CommandPalette showWriting={showWriting} initialOpen />;
}
