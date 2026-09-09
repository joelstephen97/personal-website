import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { LazyMotion, domAnimation } from "motion/react";
import { getDomains, deriveEdges } from "@/lib/content";
import { SystemMap } from "@/components/system-map/SystemMap";
import { MapChips } from "@/components/system-map/MapChips";
import { StaticMap } from "@/components/system-map/StaticMap";

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

  // Regression for a real bug (verified empirically in Chromium): pairing
  // `transformBox: "fill-box"` with an absolute SVG-coordinate
  // `transformOrigin` resolves the origin against the element's own
  // bounding-box corner, not the map's coordinate space, so `whileHover`/
  // choreographed `scale` pivots from far off the node. This check doesn't
  // depend on jsdom computing an actual transform (it doesn't do layout) —
  // it only inspects the inline style string React/Motion wrote.
  it("does not pair fill-box with a pixel transform-origin on a node <g>", () => {
    renderMap();
    const node = screen.getAllByRole("button")[0] as unknown as SVGGElement;
    const box = node.style.transformBox;
    if (box === "fill-box") {
      expect(node.style.transformOrigin).toBe("50% 50%");
    } else {
      expect(box).toBe("");
    }
  });

  it("targets the marker at the selected domain's angle on load (?domain=realtime)", () => {
    params = new URLSearchParams("domain=realtime");
    renderMap();
    const marker = document.querySelector(".map-marker") as SVGGElement;
    const realtime = domains.find((d) => d.id === "realtime")!;
    expect(marker.getAttribute("data-target-deg")).toBe(String(realtime.angle + 90));
  });

  it("returns the marker to 12 o'clock when nothing is hot or selected", () => {
    renderMap();
    const marker = document.querySelector(".map-marker") as SVGGElement;
    expect(marker.getAttribute("data-target-deg")).toBe("0");
  });

  it("wires corePath() spokes from the core to every node", () => {
    renderMap();
    const spokes = document.querySelectorAll(".map-spoke");
    expect(spokes).toHaveLength(domains.length);
    for (const spoke of spokes) {
      expect(spoke.getAttribute("d")).toMatch(/^M210 160 L/);
    }
  });
});

describe("StaticMap", () => {
  it("also wires corePath() spokes (server-safe fallback)", () => {
    render(<StaticMap domains={domains} edges={edges} />);
    expect(document.querySelectorAll(".map-spoke")).toHaveLength(domains.length);
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
