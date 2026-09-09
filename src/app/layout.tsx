import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { bodoni, cinzel, geist, geistMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/shell/ThemeProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { site } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.title}, Abu Dhabi`, template: `%s · ${site.name}` },
  description:
    "Full-stack and AI product engineer in Abu Dhabi. AI workflow platforms, real-time collaborative canvases, and full-stack products with TypeScript, React, Vue, Python, and LLM APIs. On Opus at AppliedAI. Available for consulting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bodoni.variable} ${cinzel.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#0B0C0F" />
      </head>
      <body className="bg-ground text-fg font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-2 focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <Header />
            <main id="content">{children}</main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
