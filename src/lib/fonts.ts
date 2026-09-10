import localFont from "next/font/local";
import { Cinzel, Geist, Geist_Mono } from "next/font/google";

/**
 * Newsreader is the display face: a serif commissioned for on-screen
 * reading, with even stroke contrast, so headings stay legible at phone
 * sizes. It replaced Bodoni Moda, whose hairlines were unreadable on
 * phones. Static instances (weight 500, optical size 32, Latin-1 subset)
 * are cut from Google's variable files by `scripts/instance-newsreader.py`;
 * the italic is used for the emphasised hero words.
 */
export const newsreader = localFont({
  src: [
    { path: "../fonts/Newsreader-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Newsreader-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-newsreader",
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
