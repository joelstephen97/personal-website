import { SectionHeader } from "@/components/ui/SectionHeader";
import { consultingFaq, type ConsultingFaqEntry } from "@/content/consulting-faq";

export interface FaqProps {
  /** Defaults to all six entries; a service page passes `SERVICE_FAQ_IDS`. */
  ids?: readonly string[];
  eyebrow?: string;
  title?: string;
}

/** FAQ — `<h3>` per question, muted `SectionHeader`. */
export function Faq({ ids, eyebrow = "FAQ", title = "Questions worth asking first." }: FaqProps) {
  const items: ConsultingFaqEntry[] = ids
    ? ids
        .map((id) => consultingFaq.find((entry) => entry.id === id))
        .filter((entry): entry is ConsultingFaqEntry => Boolean(entry))
    : consultingFaq;

  return (
    <section className="mt-16 border-t border-line pt-10" aria-labelledby="consulting-faq-heading">
      <SectionHeader
        as="h2"
        tone="muted"
        eyebrow={eyebrow}
        title={title}
        id="consulting-faq-heading"
      />
      <div className="mt-8 space-y-6">
        {items.map((item) => (
          <div key={item.id}>
            <h3 className="text-base font-medium text-fg">{item.q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
