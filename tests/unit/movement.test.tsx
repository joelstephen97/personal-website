import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { ReadingDial } from "@/components/movement/ReadingDial";
import { Crown } from "@/components/movement/Crown";
import { DateWindow } from "@/components/movement/DateWindow";
import { Guilloche } from "@/components/movement/Guilloche";
import { Caseback } from "@/components/movement/Caseback";
import { ComplicationDrawer } from "@/components/movement/ComplicationDrawer";

afterEach(() => {
  cleanup();
});

describe("movement components", () => {
  it("ReadingDial renders a hidden progressbar for assistive tech", () => {
    render(<ReadingDial />);
    const bar = screen.getByRole("progressbar", { name: "Page read" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow");
  });

  it("Crown calls onPress on click and exposes a default aria-label", () => {
    const onPress = vi.fn();
    render(<Crown onPress={onPress} />);
    const button = screen.getByRole("button", { name: "Open command menu" });
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("Crown accepts a custom label", () => {
    render(<Crown onPress={() => {}} label="Open menu" />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("DateWindow renders the value", () => {
    render(<DateWindow value="08" label="Day" />);
    expect(screen.getByText("08")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  it("DateWindow swaps to the new value when it changes", () => {
    const { rerender } = render(<DateWindow value="08" />);
    expect(screen.getByText("08")).toBeInTheDocument();
    rerender(<DateWindow value="09" />);
    expect(screen.getByText("09")).toBeInTheDocument();
  });

  it("Guilloche renders a canvas without crashing under jsdom's null 2d context", () => {
    render(<Guilloche className="h-40 w-40" />);
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("Caseback shows the 7-char sha and Abu Dhabi", () => {
    render(<Caseback build={{ sha: "abcdef1234567", date: "2026-09-08" }} />);
    expect(screen.getByText("abcdef1")).toBeInTheDocument();
    expect(screen.getByText(/Abu Dhabi/)).toBeInTheDocument();
    expect(screen.getByText(/Joel Stephen/)).toBeInTheDocument();
  });

  it("Caseback renders without a build prop", () => {
    render(<Caseback />);
    expect(screen.getByText(/Abu Dhabi/)).toBeInTheDocument();
  });

  it("ComplicationDrawer toggles aria-expanded and shows an item after click", () => {
    render(
      <ComplicationDrawer
        items={[
          { label: "framework", value: "Next.js" },
          { label: "motion", value: "Motion" },
        ]}
      />,
    );
    const button = screen.getByRole("button", { name: "How this page is built" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("framework")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("ComplicationDrawer panel is referenced by aria-controls", () => {
    render(<ComplicationDrawer items={[{ label: "runtime", value: "Node" }]} />);
    const button = screen.getByRole("button", { name: "How this page is built" });
    expect(button).toHaveAttribute("aria-controls");
    fireEvent.click(button);
    const panelId = button.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId as string)).toBeInTheDocument();
  });
});
