import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { getDomains, getFeaturedProjects } from "@/lib/content";
import { FeaturedWork } from "@/components/home/FeaturedWork";

const replace = vi.fn();
let params = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => params,
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => "/",
}));

const projects = getFeaturedProjects();
const domains = getDomains().map(({ id, label }) => ({ id, label }));

function renderWork() {
  return render(<FeaturedWork projects={projects} domains={domains} />);
}

afterEach(() => {
  cleanup();
  replace.mockClear();
  params = new URLSearchParams();
});

describe("FeaturedWork", () => {
  it("renders 5 cards without a filter", () => {
    renderWork();
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("renders only Flower Meister with ?domain=cv", () => {
    params = new URLSearchParams("domain=cv");
    renderWork();
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(1);
    expect(screen.getByText("Flower Meister")).toBeInTheDocument();
  });

  it("the Clear button calls router.replace with the bare pathname", () => {
    params = new URLSearchParams("domain=cv");
    renderWork();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(replace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("marks the first project's card as the flagship", () => {
    renderWork();
    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveAttribute("data-flagship");
    for (const article of articles.slice(1)) {
      expect(article).not.toHaveAttribute("data-flagship");
    }
  });

  it("links every card's title to /work/<slug>", () => {
    renderWork();
    for (const project of projects) {
      expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
        "href",
        `/work/${project.slug}`,
      );
    }
  });
});
