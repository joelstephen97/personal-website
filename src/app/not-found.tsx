import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-4 py-32 sm:px-6">
      <span className="label text-champagne">404</span>
      <h1 className="font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        No page here.
      </h1>
      <p className="text-base leading-relaxed text-fg-2">
        The link that brought you here is broken, or the page moved. Try one of these instead.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button href="/work" variant="primary">
          Work
        </Button>
        <Button href="/consulting" variant="secondary">
          Consulting
        </Button>
        <Button href="/about" variant="secondary">
          About
        </Button>
      </div>
    </div>
  );
}
