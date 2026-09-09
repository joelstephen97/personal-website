import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/MdxContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, jsonLdGraph } from "@/lib/seo";
import { getWriting } from "@/lib/content";

// No `generateStaticParams` here: under `cacheComponents`, an empty
// `generateStaticParams` result fails the build outright, and there are
// no writing posts yet (`getWriting()` is `[]` until the first one
// lands). Every future post is added by content, not code, so this
// route renders dynamically per-request instead of being prebuilt —
// once posts exist, revisit whether prebuilding is worth adding back.
//
// `instant = false` opts this one route out of Cache Components'
// static-shell prerender attempt. Without it, the build tries to
// prerender a fallback shell for this (fully dynamic) segment and trips
// on `usePathname()` in `Nav`/`BuildDrawer` inside the root layout —
// those aren't wrapped in `<Suspense>`, which every *statically*
// generated route (every other `[slug]`/`[service]` page here has a
// non-empty `generateStaticParams`) never exercises. Fixing that at the
// layout level is out of this task's scope; this keeps the one
// truly-dynamic route building without touching the shared shell.
export const instant = false;

function findPost(slug: string) {
  return getWriting().find((post) => post._meta.path === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${slug}`,
    type: "article",
  });
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd
        data={jsonLdGraph({
          path: `/writing/${slug}`,
          kind: "article",
          article: { title: post.title, date: post.date, summary: post.summary },
        })}
      />
      <p className="font-mono text-[12px] text-fg-3">{post.date}</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,1.5rem+2.8vw,3.5rem)] leading-[1.02]">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-fg-2">{post.summary}</p>
      <div className="mt-10">
        <MdxContent code={post.code} headings={post.headings} />
      </div>
    </article>
  );
}
