import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { createMdxComponents } from "@/components/mdx/components";

afterEach(() => {
  cleanup();
});

describe("createMdxComponents", () => {
  it("numbers h2 by a pure id lookup, stable across repeated renders of the same heading", () => {
    const headings = [
      { id: "problem", text: "Problem", level: 2 },
      { id: "approach", text: "Approach", level: 2 },
      { id: "result", text: "Result", level: 2 },
    ];
    const { h2: H2 } = createMdxComponents(headings);

    // Render the same heading (by id) twice, as separate component
    // instances, and assert the numeral is identical both times. A mutable
    // render-time counter would print "02" the first time and drift on the
    // second (e.g. under reactStrictMode's double-invoked renders); a pure
    // lookup by id always prints "02" for "approach".
    const first = render(<H2 id="approach">Approach</H2>);
    expect(screen.getByText("02")).toBeInTheDocument();
    first.unmount();

    render(<H2 id="approach">Approach</H2>);
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("looks up each heading's own numeral independent of render order", () => {
    const headings = [
      { id: "problem", text: "Problem", level: 2 },
      { id: "approach", text: "Approach", level: 2 },
      { id: "result", text: "Result", level: 2 },
    ];
    const { h2: H2 } = createMdxComponents(headings);

    // Render "result" (third heading) before "problem" (first heading):
    // a mutable counter, driven purely by call order, would misnumber
    // these; a pure id lookup gets both right regardless of order.
    const resultRender = render(<H2 id="result">Result</H2>);
    expect(screen.getByText("03")).toBeInTheDocument();
    resultRender.unmount();

    render(<H2 id="problem">Problem</H2>);
    expect(screen.getByText("01")).toBeInTheDocument();
  });
});
