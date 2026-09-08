import { describe, it, expect, vi, afterEach } from "vitest";
import { act } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

describe("Reveal", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
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
});
