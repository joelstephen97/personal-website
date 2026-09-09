import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import ExperiencePage from "@/app/experience/page";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

const BANNED = [
  "passionate",
  "cutting-edge",
  "innovative",
  "scalable solutions",
  "digital transformation",
  "next-generation",
  "visionary",
  "ninja",
  "rockstar",
  "10x",
  "disruptive",
  "seamless",
  "robust",
  "leverage",
  "spearheaded",
  "architected",
  "delve",
  "empower",
  "holistic",
  "journey",
  "world-class",
  "not just",
  "responsible for",
  "Technical Canvas",
  "Opus-CX",
  "n8n",
];

const PRICE_MARKERS = ["$", "USD", "AED", "/hour", "/hr"];

describe("Experience page", () => {
  it("renders 5 h2 roles in order, AppliedAI first", () => {
    render(<ExperiencePage />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    // The page also has muted h2 SectionHeaders below the rail (Education,
    // Recommendations is empty and renders nothing) — the first 5 h2s are
    // the roles, in most-recent-first content order.
    const roleHeadings = headings.slice(0, 5);
    expect(roleHeadings.map((h) => h.textContent)).toEqual([
      "Full-Stack & AI Product Engineer",
      "Senior Software Engineer",
      "Software Engineer",
      "Junior Software Engineer",
      "Software Development Engineer Intern",
    ]);
  });

  it("gives the current (AppliedAI) role all of its impact lines", () => {
    render(<ExperiencePage />);
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Full-Stack & AI Product Engineer",
    });
    const entry = heading.closest("li");
    expect(entry).not.toBeNull();
    const items = entry!.querySelectorAll("ul > li");
    expect(items.length).toBe(5);
  });

  it("shows only 2 impact lines and a 'More' summary for the RIOT entry", () => {
    render(<ExperiencePage />);
    const heading = screen.getByRole("heading", { level: 2, name: "Junior Software Engineer" });
    const entry = heading.closest("li");
    expect(entry).not.toBeNull();

    const visibleItems = entry!.querySelectorAll("ul > li");
    expect(visibleItems.length).toBe(2);

    const summary = entry!.querySelector("details > summary");
    expect(summary).not.toBeNull();
    expect(summary).toHaveTextContent("More");
    expect(summary).toHaveAttribute("aria-expanded", "false");
  });

  it("has exactly one h1", () => {
    render(<ExperiencePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("contains no banned words or prices", () => {
    const { container } = render(<ExperiencePage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
  });
});
