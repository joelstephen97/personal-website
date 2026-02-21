/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        display: ["3.05rem", { lineHeight: "1.1" }],
        h1: ["2.44rem", { lineHeight: "1.2" }],
        h2: ["1.95rem", { lineHeight: "1.3" }],
        h3: ["1.56rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.8rem", { lineHeight: "1.5" }],
      },
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--foreground-secondary) / <alpha-value>)",
        "muted-foreground": "rgb(var(--foreground-muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-hover": "rgb(var(--accent-hover) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        terminal: {
          bg: "rgb(var(--terminal-bg) / <alpha-value>)",
          DEFAULT: "rgb(var(--terminal-text) / <alpha-value>)",
          muted: "rgb(var(--terminal-muted) / <alpha-value>)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
