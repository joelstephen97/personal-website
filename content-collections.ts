import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

/** Tiny local slugify for heading ids: no dependency needed for this. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// No explicit return-type annotation here: content-collections requires a
// `transform` result whose shape is inferred as plain object/array literals
// (its serializability check rejects values typed through a named
// interface, even when structurally identical). `Heading` is re-declared,
// for consumers, in src/components/mdx/components.tsx.
function extractHeadings(markdown: string) {
  return Array.from(markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match) => {
    const hashes = match[1] ?? "##";
    const text = (match[2] ?? "").trim();
    return { id: slugify(text), text, level: hashes.length };
  });
}

const work = defineCollection({
  name: "work",
  directory: "content/work",
  include: "**/*.mdx",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    order: z.number(),
  }),
  transform: async (document, context) => {
    const code = await compileMDX(context, document);
    const headings = extractHeadings(document.content);
    return { ...document, code, headings };
  },
});

const writing = defineCollection({
  name: "writing",
  directory: "content/writing",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    type: z.enum(["article", "note"]),
    draft: z.boolean().optional(),
  }),
  transform: async (document, context) => {
    const code = await compileMDX(context, document);
    const headings = extractHeadings(document.content);
    const words = document.content.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.round(words / 220));
    return { ...document, code, headings, readingMinutes };
  },
});

export default defineConfig({ content: [work, writing] });
