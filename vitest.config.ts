import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Mirrors tsconfig's path mapping for the content-collections virtual
      // module — Next's `withContentCollections` plugin provides this alias
      // at build time; Vite/vitest needs it spelled out.
      "content-collections": path.resolve(__dirname, ".content-collections/generated"),
    },
  },
});
