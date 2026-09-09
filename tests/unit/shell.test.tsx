import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { Header } from "@/components/shell/Header";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { MobileSheet } from "@/components/shell/MobileSheet";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { ThemeProvider } from "@/components/shell/ThemeProvider";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("Header", () => {
  it("renders the wordmark and the four nav links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Joel Stephen" })).toHaveAttribute("href", "/");

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const label of ["Work", "Experience", "Consulting", "About"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });
});

describe("CommandPalette", () => {
  it("opens on Cmd+K and exposes a dialog", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape", () => {
    render(<CommandPalette />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("MobileSheet", () => {
  it("traps Tab focus within the panel", () => {
    const onClose = vi.fn();
    render(<MobileSheet open onClose={onClose} />);

    const dialog = screen.getByRole("dialog", { name: "Menu" });
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    expect(focusable.length).toBeGreaterThan(1);

    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    last.focus();
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<MobileSheet open onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("flips data-theme on the html element", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button");
    const initial = document.documentElement.getAttribute("data-theme");
    expect(initial).toBe("dark");

    fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
