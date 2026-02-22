// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@huggingface/transformers"],
            message:
              "Use getTransformers() from ~/composables/useTransformersClient instead.",
          },
        ],
      },
    ],
  },
});
