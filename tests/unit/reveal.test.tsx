import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";

// Wrap the real `stagger` helper in a spy so we can assert on how `Reveal`
// calls it (the `delay` prop must reach the variant's own transition —
// see the "threads the delay prop" test below), while keeping its real
// behavior for every other export used by Reveal/RevealItem.
vi.mock("@/lib/motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/motion")>();
  return {
    ...actual,
    stagger: vi.fn(actual.stagger),
  };
});

describe("stagger", () => {
  it("carries the given delayChildren into the show variant's transition", () => {
    expect(stagger(0.06, 0.3).show).toMatchObject({
      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
    });
  });
});

describe("Reveal", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders children fully in the document (server-like render)", () => {
    render(
      <Reveal>
        <RevealItem>Hello from Reveal</RevealItem>
      </Reveal>,
    );

    expect(screen.getByText("Hello from Reveal")).toBeInTheDocument();
  });

  it("never paints an element already in the viewport at opacity 0", async () => {
    // jsdom's default window.innerHeight is 768; report a rect that sits
    // comfortably inside it (and inside the -10% viewport margin).
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON() {
        return {};
      },
    } as DOMRect);

    await act(async () => {
      render(
        <Reveal>
          <RevealItem>In view text</RevealItem>
        </Reveal>,
      );
    });

    await waitFor(() => {
      const el = screen.getByText("In view text");
      expect(el.style.opacity).not.toBe("0");
    });
  });

  it("threads the delay prop into the stagger variant, not a shadowed transition prop", async () => {
    // Off-screen rect: exercises the `whileInView` branch, which — like the
    // in-view branch — must build its variants via `stagger(0.06, delay ?? 0.08)`.
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 5000,
      bottom: 5100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 5000,
      toJSON() {
        return {};
      },
    } as DOMRect);

    await act(async () => {
      render(
        <Reveal delay={0.3}>
          <RevealItem>Delayed text</RevealItem>
        </Reveal>,
      );
    });

    await waitFor(() => {
      expect(stagger).toHaveBeenCalledWith(0.06, 0.3);
    });
  });

  it("falls back to the default 0.08 delayChildren when no delay prop is passed", async () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 5000,
      bottom: 5100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 5000,
      toJSON() {
        return {};
      },
    } as DOMRect);

    await act(async () => {
      render(
        <Reveal>
          <RevealItem>No explicit delay</RevealItem>
        </Reveal>,
      );
    });

    await waitFor(() => {
      expect(stagger).toHaveBeenCalledWith(0.06, 0.08);
    });
  });
});
