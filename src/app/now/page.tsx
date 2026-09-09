import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getNow } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Now",
  description: "What I'm building, exploring, reading, and doing away from the keyboard.",
  path: "/now",
});

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-09" -> "September 2026". Pure string formatting of static content — no `Date` at request time. */
function formatMonthYear(updated: string): string {
  const [year, month] = updated.split("-");
  const monthName = MONTH_NAMES[Number(month) - 1] ?? month;
  return `${monthName} ${year}`;
}

export default function NowPage() {
  const now = getNow();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/now", kind: "about" })} />

      <SectionHeader as="h1" eyebrow="Now" title={formatMonthYear(now.updated)} />

      <dl className="mt-12 space-y-10">
        <div>
          <dt className="label text-fg-3">Building</dt>
          <dd className="mt-4">
            <ul className="list-disc space-y-2 pl-5">
              {now.building.map((item) => (
                <li key={item} className="text-base leading-relaxed text-fg-2">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="label text-fg-3">Exploring</dt>
          <dd className="mt-4">
            <ul className="list-disc space-y-2 pl-5">
              {now.exploring.map((item) => (
                <li key={item} className="text-base leading-relaxed text-fg-2">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <div>
          <dt className="label text-fg-3">Reading</dt>
          <dd className="mt-4 text-base leading-relaxed text-fg-2">{now.reading}</dd>
        </div>

        <div>
          <dt className="label text-fg-3">Away from the keyboard</dt>
          <dd className="mt-4 text-base leading-relaxed text-fg-2">{now.away}</dd>
        </div>
      </dl>
    </div>
  );
}
