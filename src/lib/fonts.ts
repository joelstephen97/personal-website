import localFont from "next/font/local";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";

/**
 * Bodoni Moda ships as two static instances (weight 500, optical size 60,
 * Latin subset) cut from Google's variable font with fontTools. The
 * variable files were 54 kB + 47 kB and sat in the critical path of every
 * first paint; the instances are 15 kB + 17 kB. Weight 500 is the display
 * weight the design specifies; opsz 60 sits between the smallest (20 px)
 * and largest (~84 px) sizes Bodoni is set at, so hairlines stay legible
 * on the dark ground. Regenerate with `scripts/instance-bodoni.py`.
 */
export const bodoni = localFont({
  src: [
    { path: "../fonts/BodoniModa-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BodoniModa-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-bodoni",
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
