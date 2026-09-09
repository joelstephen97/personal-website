import { SectionHeader } from "@/components/ui/SectionHeader";
import { facts, benchmark, scale } from "@/content/scamshield-facts";

/**
 * ScamShield-only case-study additions: a "Did you know" fact list, the
 * published benchmark table, and a compact scale line. Rendered only when
 * `project.slug === "scamshield"` in `work/[slug]/page.tsx` — every other
 * case study must not render any of this (see `tests/unit/work.test.tsx`).
 * Both `SectionHeader`s use `tone="muted"` so this block spends nothing
 * from the page's champagne budget.
 */
export function ScamShieldExtras() {
  return (
    <div className="space-y-12 border-t border-line py-10">
      <aside aria-labelledby="did-you-know-heading">
        <SectionHeader
          tone="muted"
          eyebrow="Did you know"
          title="Ten things inside the extension."
          id="did-you-know-heading"
        />
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-fg-2 marker:text-fg-3 marker:font-mono">
          {facts.map((fact) => (
            <li key={fact} className="pl-1">
              {fact}
            </li>
          ))}
        </ol>
      </aside>

      <section aria-labelledby="benchmark-heading">
        <SectionHeader
          tone="muted"
          eyebrow="Benchmark"
          title="How it performs."
          id="benchmark-heading"
        />
        <div
          className="mt-6 overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Benchmark table, scrollable on narrow screens"
        >
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="mb-3 text-left text-xs leading-relaxed text-fg-3">
              {`Published benchmark, run ${benchmark.date}; methodology in the repository`}
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-fg">
                  Set
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-fg">
                  n
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-fg">
                  Blocked before load
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-fg">
                  Stopped
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-fg">
                  Warned
                </th>
                <th scope="col" className="py-2 font-medium text-fg">
                  Hard false positives
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmark.rows.map((row) => (
                <tr key={row.set} className="border-b border-line-2">
                  <th scope="row" className="py-2 pr-4 text-left font-normal text-fg-2">
                    {row.set}
                  </th>
                  <td className="py-2 pr-4 text-fg-2">{row.n}</td>
                  <td className="py-2 pr-4 text-fg-2">{row.blockedBeforeLoad}</td>
                  <td className="py-2 pr-4 text-fg-2">{row.stopped}</td>
                  <td className="py-2 pr-4 text-fg-2">{row.warned}</td>
                  <td className="py-2 text-fg-2">{row.hardFalsePositives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-xs text-fg-3">
          {scale.unitTests} unit tests · {scale.e2eTests} end-to-end tests · {scale.commits} commits
          in {scale.days} days · {scale.zippedKb} KB zipped · {scale.locales} locales
        </p>
      </section>
    </div>
  );
}
