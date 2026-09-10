import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { act } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { KeyCap } from "@/components/ui/KeyCap";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Tooltip } from "@/components/ui/Tooltip";
import { TextLink } from "@/components/ui/TextLink";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ui primitives", () => {
  it("Button renders a link when href is given", () => {
    render(<Button href="/work">Selected work</Button>);
    expect(screen.getByRole("link", { name: "Selected work" })).toHaveAttribute("href", "/work");
  });
  it("Button renders a button otherwise", () => {
    render(<Button variant="ghost">Copy</Button>);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });
  it("SectionHeader renders eyebrow and h2", () => {
    render(<SectionHeader eyebrow="Selected work" title="Five things" />);
    expect(screen.getByRole("heading", { level: 2, name: "Five things" })).toBeInTheDocument();
    expect(screen.getByText("Selected work")).toHaveClass("label");
  });

  it('SectionHeader tone="muted" spends no champagne classes', () => {
    const { container } = render(
      <SectionHeader eyebrow="Now" title="September 2026" tone="muted" />,
    );
    const eyebrow = screen.getByText("Now");
    expect(eyebrow).toHaveClass("text-fg-3");
    expect(eyebrow).not.toHaveClass("text-champagne");
    expect(container.querySelector(".bg-champagne-line")).not.toBeInTheDocument();
    expect(container.querySelector(".text-champagne")).not.toBeInTheDocument();
  });
  it("Tag and KeyCap render text", () => {
    render(
      <>
        <Tag>React</Tag>
        <KeyCap>⌘</KeyCap>
      </>,
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("⌘")).toBeInTheDocument();
  });
  it("Card interactive renders the given as tag", () => {
    render(
      <Card as="article" interactive data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId("card").tagName).toBe("ARTICLE");
  });
  it('Callout tone="confidential" renders its title', () => {
    render(
      <Callout tone="confidential" title="Under NDA">
        Details withheld.
      </Callout>,
    );
    expect(screen.getByText("Under NDA")).toBeInTheDocument();
  });

  it("Tooltip content is always in the DOM, hidden until opened, trigger has aria-describedby", () => {
    render(
      <Tooltip label="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const content = screen.getByRole("tooltip");
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Hint");
    expect(content).toHaveClass("opacity-0");
    expect(trigger).toHaveAttribute("aria-describedby", content.id);
  });

  it("Tooltip: focusing the trigger shows it immediately", () => {
    render(
      <Tooltip label="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const content = screen.getByRole("tooltip");
    fireEvent.focus(trigger);
    expect(content).toHaveClass("opacity-100");
  });

  it("Tooltip: pointerenter shows it only after the 60ms delay", () => {
    vi.useFakeTimers();
    render(
      <Tooltip label="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const content = screen.getByRole("tooltip");

    fireEvent.pointerEnter(trigger);

    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(content).toHaveClass("opacity-0");

    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(content).toHaveClass("opacity-100");
  });

  it("Tooltip: Escape hides an open tooltip", () => {
    render(
      <Tooltip label="Hint">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    const content = screen.getByRole("tooltip");
    fireEvent.focus(trigger);
    expect(content).toHaveClass("opacity-100");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(content).toHaveClass("opacity-0");
  });

  it("TextLink external renders rel=noopener noreferrer, target=_blank, and the ↗ glyph", () => {
    render(
      <TextLink href="https://example.com" external>
        External
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("↗");
  });

  it("TextLink without external renders a next/link anchor with link-draw", () => {
    render(<TextLink href="/">Home</TextLink>);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass("link-draw");
  });
});
