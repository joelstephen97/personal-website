import { LabEntry } from "./schema";

export const lab = LabEntry.array().parse([
  {
    slug: "speech-to-text",
    title: "Speech to Text",
    blurb: "On-device transcription running entirely in the browser, no audio leaving the tab.",
    buildLog:
      "A Web Speech / WASM model comparison, then a build around whichever holds up on accented English without a server round trip.",
    group: "ml",
    tier: 1,
    status: "planned",
  },
  {
    slug: "image-captioning",
    title: "Image Captioning",
    blurb: "Drop an image in, get a plain-English caption back, model running client-side.",
    buildLog:
      "A small vision-to-text model exported to run in the browser, with a fallback caption when the model is unsure rather than a confident wrong answer.",
    group: "ml",
    tier: 1,
    status: "planned",
  },
  {
    slug: "bg-remover",
    title: "Background Remover",
    blurb: "Cuts a subject out of a photo on-device, no upload to a server.",
    buildLog:
      "A segmentation model small enough to ship in a page load, with the matting cleanup that separates a usable cutout from a rough mask.",
    group: "ml",
    tier: 1,
    status: "planned",
  },
  {
    slug: "pathfinding-visualizer",
    title: "Pathfinding Visualizer",
    blurb: "Watch A*, Dijkstra, and BFS search a grid, cell by cell.",
    buildLog:
      "A canvas-rendered grid with the search frontier drawn frame by frame, so the difference between the algorithms shows in how they search, not only in their run time.",
    group: "algorithms",
    tier: 1,
    status: "planned",
  },
  {
    slug: "sorting-visualizer",
    title: "Sorting Visualizer",
    blurb:
      "Bars rearranging themselves under quicksort, merge sort, and heapsort, at a speed you control.",
    buildLog:
      "Each algorithm instrumented to yield its comparisons and swaps as a sequence, so the visualization is a replay of real steps, not an animation approximating them.",
    group: "algorithms",
    tier: 1,
    status: "planned",
  },
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    blurb: "Conway's cellular automaton on an infinite, pannable grid.",
    buildLog:
      "A sparse grid representation so the simulation stays fast past the small finite boards most implementations stop at.",
    group: "algorithms",
    tier: 1,
    status: "planned",
  },
  {
    slug: "aim-trainer",
    title: "Aim Trainer",
    blurb: "A reflex-and-accuracy target game with a running score and timing breakdown.",
    buildLog:
      "Target spawn timing and hit detection built for consistent frame pacing, then a scoring model that separates speed from accuracy.",
    group: "games",
    tier: 1,
    status: "planned",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    blurb: "Live regex matching against sample text, with each capture group highlighted.",
    buildLog:
      "A debounced match loop plus a plain-English breakdown of what each part of the pattern does, for the parts of regex syntax that are easy to forget.",
    group: "tools",
    tier: 1,
    status: "planned",
  },
  {
    slug: "json-diff",
    title: "JSON Diff",
    blurb: "Structural diffing between two JSON documents, keyed on value not line position.",
    buildLog:
      "A tree diff instead of a text diff, so reordered keys and reformatted whitespace do not show up as changes that were never made.",
    group: "tools",
    tier: 1,
    status: "planned",
  },
  {
    slug: "cron-parser",
    title: "Cron Parser",
    blurb: "Paste a cron expression, see its next ten run times in plain language.",
    buildLog:
      "A small parser for the standard five-field syntax plus the common extensions people actually use.",
    group: "tools",
    tier: 2,
    status: "planned",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    blurb: "MD5, SHA-1, and SHA-256 hashes of text or a dropped file, computed on-device.",
    buildLog:
      "Web Crypto for the SHA family, with streaming for files too large to hash in one pass.",
    group: "tools",
    tier: 2,
    status: "planned",
  },
  {
    slug: "color-palette",
    title: "Color Palette",
    blurb: "Pull a color palette out of an image, or generate one from a single seed color.",
    buildLog:
      "K-means clustering on image pixels for extraction, and an HSL-based generator for the from-scratch case.",
    group: "tools",
    tier: 2,
    status: "planned",
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    blurb: "Side-by-side markdown editing and rendered preview, synced scroll.",
    buildLog:
      "A markdown parser wired to a virtualized preview pane so long documents stay smooth while typing.",
    group: "tools",
    tier: 2,
    status: "planned",
  },
  {
    slug: "audio-visualizer",
    title: "Audio Visualizer",
    blurb: "Reactive waveform and frequency visuals driven by microphone or file input.",
    buildLog:
      "The Web Audio API's analyser node feeding a canvas render loop, tuned to stay smooth at 60fps.",
    group: "tools",
    tier: 2,
    status: "planned",
  },
]);

export const retiredLabSlugs = [
  "rainbow-6-randomizer",
  "eye-dropper",
  "screen-capture",
  "local-file-editor",
];
