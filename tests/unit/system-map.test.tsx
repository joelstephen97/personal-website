import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { LazyMotion, domAnimation } from "motion/react";
import { getDomains, deriveEdges } from "@/lib/content";
import { SystemMap } from "@/components/system-map/SystemMap";
import { MapChips } from "@/components/system-map/MapChips";

const replace = vi.fn();
let params = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => params,
  useRouter: () => ({ replace }),
  usePathname: () => "/",
}));

const domains = getDomains();
const edges = deriveEdges();
const projectsBySlug = Object.fromEntries(
  domains.flatMap((d) => d.work).map((slug) => [slug, { slug, title: slug }]),
);

function renderMap() {
  return render(
    <LazyMotion features={domAnimation} strict>
      <SystemMap domains={domains} edges={edges} projectsBySlug={projectsBySlug} />
    </LazyMotion>,
  );
}

afterEach(() => {
  cleanup();
  replace.mockClear();
  params = new URLSearchParams();
});

describe("SystemMap", () => {
  it("renders 6 domain nodes and the core monogram", () => {
    renderMap();
    const nodes = screen.getAllByRole("button");
    expect(nodes).toHaveLength(6);
    for (const node of nodes) {
      expect(node).toHaveAttribute("aria-pressed", "false");
    }
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("moves focus to the next node with ArrowRight", () => {
    renderMap();
    const nodes = screen.getAllByRole("button");
    nodes[0]?.focus();
    expect(document.activeElement).toBe(nodes[0]);

    fireEvent.keyDown(nodes[0] as HTMLElement, { key: "ArrowRight" });

    expect(document.activeElement).toBe(nodes[1]);
    expect(document.activeElement?.getAttribute("data-id")).toBe(domains[1]?.id);
  });

  it("calls router.replace with the domain on Enter", () => {
    renderMap();
    const nodes = screen.getAllByRole("button");
    const first = nodes[0] as HTMLElement;
    expect(first.getAttribute("data-id")).toBe("ai");
    first.focus();

    fireEvent.keyDown(first, { key: "Enter" });

    expect(replace).toHaveBeenCalledWith("/?domain=ai", { scroll: false });
  });

  it("marks the node matching ?domain= as pressed", () => {
    params = new URLSearchParams("domain=realtime");
    renderMap();
    const realtimeNode = screen
      .getAllByRole("button")
      .find((n) => n.getAttribute("data-id") === "realtime");
    expect(realtimeNode).toHaveAttribute("aria-pressed", "true");
  });

  it("renders a hidden tooltip description for every domain before any hover", () => {
    renderMap();
    for (const d of domains) {
      expect(document.getElementById(`map-tip-${d.id}`)).toBeInTheDocument();
    }
  });
});

describe("MapChips", () => {
  it("renders 7 buttons (All + 6 domains)", () => {
    render(<MapChips domains={domains} />);
    const group = screen.getByRole("group", { name: "Filter work by domain" });
    expect(within(group).getAllByRole("button")).toHaveLength(7);
  });

  it("clicking a domain chip calls router.replace with its domain", () => {
    render(<MapChips domains={domains} />);
    fireEvent.click(screen.getByRole("button", { name: "Interfaces" }));
    expect(replace).toHaveBeenCalledWith("/?domain=interfaces", { scroll: false });
  });
});
