import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

describe("Reveal", () => {
  it("renders children fully in the document (server-like render)", () => {
    render(
      <Reveal>
        <RevealItem>Hello from Reveal</RevealItem>
      </Reveal>,
    );

    expect(screen.getByText("Hello from Reveal")).toBeInTheDocument();
  });
});
