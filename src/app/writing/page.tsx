import type { Metadata } from "next";
import { TextLink } from "@/components/ui/TextLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getWriting } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description: "Notes on AI systems, real-time collaboration, and shipping software.",
  path: "/writing",
});

export default function WritingPage() {
  const posts = getWriting();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={jsonLdGraph({ path: "/writing", kind: "work" })} />

      <h1 className="font-display lg:font-display-lg text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        Writing
      </h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-lg leading-relaxed text-fg-2">Notes are on the way.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line">
          {posts.map((post) => (
            <li key={post._meta.path} className="py-5">
              <TextLink href={`/writing/${post._meta.path}`} className="text-lg">
                {post.title}
              </TextLink>
              <p className="mt-1 text-sm text-fg-2">{post.summary}</p>
              <p className="mt-1 font-mono text-[12px] text-fg-3">{post.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
