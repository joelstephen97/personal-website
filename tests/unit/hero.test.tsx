import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { CredibilityStrip } from "@/components/home/CredibilityStrip";
import { ConsultingBlock } from "@/components/home/ConsultingBlock";
import { ExperienceCompressed } from "@/components/home/ExperienceCompressed";
import { NowBlock } from "@/components/home/NowBlock";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

// Reduced motion is the deterministic, easily-testable path for asserting
// "no inline opacity": it's the same branch the global constraints already
// require ("hero words visible at mount" under reduced motion), and it
// avoids depending on Motion's mount-time inline styling, which this test
// isn't trying to characterize.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => true };
});

afterEach(() => {
  cleanup();
});

describe("HeroHeadline", () => {
  const words = ["Building", "AI", "systems", "and", "the", "interfaces"];
  const emphasis = ["people", "run", "them", "from."];

  it("renders all ten words as text with no inline opacity (reduced motion / server-like)", () => {
    const { container } = render(<HeroHeadline words={words} emphasis={emphasis} />);

    const bodyText = container.textContent ?? "";
    for (const w of [...words, ...emphasis]) {
      expect(bodyText).toContain(w);
    }

    for (const el of container.querySelectorAll<HTMLElement>("span")) {
      expect(el.style.opacity).toBe("");
    }
  });

  it("wraps the emphasis words in a single <em>", () => {
    const { container } = render(<HeroHeadline words={words} emphasis={emphasis} />);
    const em = container.querySelector("em");
    expect(em).toBeInTheDocument();
    expect(em).toHaveClass("italic");
    expect(em?.textContent).toBe("people run them from.");
  });
});

describe("CredibilityStrip", () => {
  it("renders the Y Combinator item with a tooltip id resolving to its tip text", () => {
    render(<CredibilityStrip />);

    const label = screen.getByText("Y Combinator X26");
    const trigger = label.closest("[aria-describedby]");
    expect(trigger).not.toBeNull();

    const tooltipId = trigger!.getAttribute("aria-describedby")!;
    const tooltip = document.getElementById(tooltipId);
    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(tooltip?.textContent).toContain("top 10% of applications");
  });

  it("separates items with bg-line-2 dots, not champagne", () => {
    const { container } = render(<CredibilityStrip />);
    const dots = container.querySelectorAll('[aria-hidden="true"].bg-line-2');
    expect(dots.length).toBeGreaterThan(0);
    expect(container.querySelector(".bg-champagne")).not.toBeInTheDocument();
  });
});

describe("home — champagne budget", () => {
  it("ExperienceCompressed + NowBlock co-rendered spend at most 3 champagne-classed elements", () => {
    const { container } = render(
      <>
        <ExperienceCompressed />
        <NowBlock />
      </>,
    );
    const champagneEls = container.querySelectorAll('[class*="champagne"]');
    expect(champagneEls.length).toBeLessThanOrEqual(3);
  });
});

describe("ConsultingBlock", () => {
  it("contains no pricing language", () => {
    const { container } = render(<ConsultingBlock />);
    const text = container.textContent ?? "";
    for (const banned of ["$", "USD", "AED", "/hour", "Unpriced"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("shows the exact h3 copy and a mailto CTA", () => {
    render(<ConsultingBlock />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "You shipped an AI feature. Now it has to work in production.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Book a roadmapping session")).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });
});
