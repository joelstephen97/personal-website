import { describe, it, expect } from "vitest";
import {
  MAP,
  nodePosition,
  shortestRotation,
  bezelTicks,
  arcPath,
  corePath,
  markerTargetDeg,
} from "@/components/system-map/geometry";
describe("geometry", () => {
  it("places a −90° node at 12 o'clock", () => {
    const p = nodePosition(-90);
    expect(p.x).toBeCloseTo(MAP.cx, 5);
    expect(p.y).toBeCloseTo(MAP.cy - MAP.ringR, 5);
  });
  it("takes the shortest arc", () => {
    expect(shortestRotation(350, 10)).toBe(370);
    expect(shortestRotation(10, 350)).toBe(-10);
    expect(shortestRotation(0, 180)).toBe(180);
  });
  it("emits 60 ticks with 12 majors", () => {
    const t = bezelTicks();
    expect(t).toHaveLength(60);
    expect(t.filter((x) => x.major)).toHaveLength(12);
  });
  it("builds paths", () => {
    expect(corePath(-90)).toMatch(/^M210 160 L/);
    expect(arcPath(-90, -30)).toMatch(/^M.* Q.* .*$/);
  });
  it("resolves the marker's target degrees, defaulting to 12 o'clock when nothing is hot/selected", () => {
    expect(markerTargetDeg(-90)).toBe(0);
    expect(markerTargetDeg(-30)).toBe(60); // realtime: angle -30 -> marker 60
    expect(markerTargetDeg(null)).toBe(0);
  });
});
