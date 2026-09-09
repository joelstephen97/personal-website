"use client";

import { useState } from "react";
import Link from "next/link";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ReadingDial } from "@/components/movement/ReadingDial";
import { Crown } from "@/components/movement/Crown";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Nav } from "./Nav";
import { MobileSheet } from "./MobileSheet";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

const SCROLL_THRESHOLD = 24;

/** Opens the (self-contained) command palette from anywhere, e.g. the Crown. */
function openPalette(): void {
  window.dispatchEvent(new Event("palette:open"));
}

export interface HeaderProps {
  /** From `hasWriting()`, computed server-side in `layout.tsx` — the
   * writing content-collection is never imported into this client code. */
  showWriting?: boolean;
}

export function Header({ showWriting = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > SCROLL_THRESHOLD);
  });

  return (
    <>
      <m.header
        data-scrolled={scrolled || undefined}
        className={cn(
          "sticky top-0 z-[var(--z-header)] border-b transition-colors duration-[var(--dur-slow)]",
          scrolled ? "glass border-line" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="font-display text-[22px] leading-none text-fg">
            Joel Stephen
          </Link>

          <Nav showWriting={showWriting} />

          <div className="flex items-center gap-3">
            <ReadingDial size={22} className="hidden md:flex" />
            <Crown onPress={openPalette} />
            <Button
              variant="secondary"
              size="sm"
              href="/joel-stephen-resume.pdf"
              external
              className="hidden md:inline-flex"
              onClick={() => track("resume_click", { location: "header" })}
            >
              Résumé
            </Button>
            <ThemeToggle className="hidden md:inline-flex" />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              className="inline-flex size-9 items-center justify-center rounded-full border border-line-2 text-fg-2 md:hidden"
            >
              <span aria-hidden="true" className="font-mono text-sm">
                &#9776;
              </span>
            </button>
          </div>
        </div>
      </m.header>

      <MobileSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        showWriting={showWriting}
      />
      <CommandPalette showWriting={showWriting} />
    </>
  );
}
