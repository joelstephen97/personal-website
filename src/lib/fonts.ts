import localFont from "next/font/local";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";

/**
 * Bodoni Moda ships as static instances (weight 500, Latin subset) cut
 * from Google's variable font with `scripts/instance-bodoni.py`. Google's
 * variable files were 54 kB + 47 kB and sat in the critical path of every
 * first paint; each instance is about 15 kB.
 *
 * Two optical sizes, because Bodoni's hairlines are tuned by the `opsz`
 * axis and a single display cut collapses at phone sizes: `bodoni`
 * (opsz 28) is the default for every `font-display` heading, `bodoniDisplay`
 * (opsz 84, with the italic used in the hero) is for the page-level h1s set
 * at 36 px and above (`font-display-lg`).
 */
export const bodoni = localFont({
  src: [{ path: "../fonts/BodoniModa-500-text.woff2", weight: "500", style: "normal" }],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const bodoniDisplay = localFont({
  src: [
    { path: "../fonts/BodoniModa-500-display.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BodoniModa-500-display-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-bodoni-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Labels only ever render at weight 500 (the `label` utility). */
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-cinzel",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
