import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const work = defineCollection({
  name: "work",
  directory: "content/work",
  include: "**/*.mdx",
  schema: z.object({ title: z.string() }),
});
export default defineConfig({ content: [work] });
