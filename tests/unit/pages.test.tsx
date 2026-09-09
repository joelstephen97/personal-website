import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import ExperiencePage from "@/app/experience/page";
import ConsultingPage from "@/app/consulting/page";
import ServicePage from "@/app/consulting/[service]/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import ResumePage from "@/app/resume/page";
import WorkDetailPage from "@/app/work/[slug]/page";
import { getServices, getExperience } from "@/lib/content";
import { aboutCopy } from "@/content/about-copy";
import { site } from "@/lib/site";

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

describe("Consulting page", () => {
  it("has exactly one h1 with the hero sentence", () => {
    render(<ConsultingPage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(
      "You shipped an AI feature. Now it has to work in production.",
    );
  });

  it("links all six ladder services to their /consulting/<slug> pages", () => {
    const { container } = render(<ConsultingPage />);
    const slugs = getServices()
      .filter((s) => s.slug !== null)
      .map((s) => s.slug as string);
    expect(slugs).toHaveLength(6);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    for (const slug of slugs) {
      expect(hrefs, slug).toContain(`/consulting/${slug}`);
    }
  });

  it("shows six FAQ questions as h3", () => {
    const { container } = render(<ConsultingPage />);
    const faqSection = container.querySelector("[aria-labelledby='consulting-faq-heading']");
    expect(faqSection).not.toBeNull();
    const questions = faqSection!.querySelectorAll("h3");
    expect(questions).toHaveLength(6);
  });

  it("contains no banned words, no prices, and never renders 'Unpriced'", () => {
    const { container } = render(<ConsultingPage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
    expect(rawText).not.toContain("Unpriced");
  });
});

describe("Service page", () => {
  it("renders the service's answer first", async () => {
    const element = await ServicePage({ params: Promise.resolve({ service: "ai-integration" }) });
    const { container } = render(element);
    const service = getServices().find((s) => s.slug === "ai-integration")!;
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(paragraphs[0]).toHaveTextContent(service.answer);
  });

  it("contains no banned words, no prices, and never renders 'Unpriced'", async () => {
    const element = await ServicePage({ params: Promise.resolve({ service: "ai-integration" }) });
    const { container } = render(element);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
    expect(rawText).not.toContain("Unpriced");
  });
});

describe("About page", () => {
  it("renders the h1 verbatim from about-copy.ts", () => {
    render(<AboutPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(aboutCopy.heading);
  });

  it("contains no banned words or prices", () => {
    const { container } = render(<AboutPage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
  });
});

describe("Contact page", () => {
  it("renders no <form>", () => {
    const { container } = render(<ContactPage />);
    expect(container.querySelector("form")).toBeNull();
  });

  it("contains no banned words or prices", () => {
    const { container } = render(<ContactPage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
  });
});

describe("Resume page", () => {
  it("contains the title and all five role headings", () => {
    const { container } = render(<ResumePage />);
    expect(container.textContent).toContain(site.title);
    const roleNames = getExperience().map((role) => role.role);
    const headings = Array.from(container.querySelectorAll("h3")).map((h) => h.textContent);
    for (const name of roleNames) {
      expect(headings, name).toContain(name);
    }
  });

  it("contains no banned words or prices", () => {
    const { container } = render(<ResumePage />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const w of BANNED) expect(text, w).not.toContain(w.toLowerCase());
    const rawText = container.textContent ?? "";
    for (const marker of PRICE_MARKERS) expect(rawText, marker).not.toContain(marker);
  });
});

describe("Work detail page — ScamShield content elevation", () => {
  it("/work/scamshield contains the scale line ('903') and the benchmark caption", async () => {
    const element = await WorkDetailPage({ params: Promise.resolve({ slug: "scamshield" }) });
    const { container } = render(element);
    expect(container.textContent).toContain("903");
    expect(container.textContent).toContain(
      "Published benchmark, run 2026-09-07; methodology in the repository",
    );
  });

  it("/work/scamshield renders the 'Did you know' aside as a numbered list", async () => {
    const element = await WorkDetailPage({ params: Promise.resolve({ slug: "scamshield" }) });
    const { container } = render(element);
    expect(screen.getByText("Ten things inside the extension.")).toBeInTheDocument();
    const list = container.querySelector("ol");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li").length).toBe(10);
  });

  it("another case study (flower-meister) does not render the ScamShield extras", async () => {
    const element = await WorkDetailPage({ params: Promise.resolve({ slug: "flower-meister" }) });
    const { container } = render(element);
    expect(container.textContent).not.toContain("Did you know");
    expect(container.textContent).not.toContain("Ten things inside the extension.");
    expect(container.textContent).not.toContain(
      "Published benchmark, run 2026-09-07; methodology in the repository",
    );
  });
});
