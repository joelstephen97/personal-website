import { describe, it, expect } from "vitest";
import { spring, ease, dur, reveal, stagger, word } from "@/lib/motion";

describe("motion tokens", () => {
  it("matches the spec", () => {
    expect(spring.detent).toEqual({ type: "spring", stiffness: 380, damping: 22, mass: 1 });
    expect(ease.outExpo).toEqual([0.16, 1, 0.3, 1]);
    expect(dur.reveal).toBe(0.56);
    expect(reveal.hidden).toEqual({ opacity: 0, y: 12 });
    expect(typeof reveal.show).toBe("function");
    expect(stagger().show).toMatchObject({
      transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    });
    expect(word.hidden).toMatchObject({ filter: "blur(6px)" });
  });
});
