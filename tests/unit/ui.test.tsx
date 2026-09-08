import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { KeyCap } from "@/components/ui/KeyCap";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";

afterEach(cleanup);

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
});
