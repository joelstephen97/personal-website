// v-reveal — fade/slide (and optional scale) an element in the first time it
// enters the viewport, using motion-v's imperative inView + animate.
// Client-only plugin. Call-sites unchanged: v-reveal | v-reveal="{ delay }" |
// v-reveal="300" | v-reveal="{ delay, scale: true }".
import { animate, inView } from "motion-v";
import { EASE_ENTRANCE, DURATION } from "~/constants/motion";

type RevealValue = number | { delay?: number; scale?: boolean } | undefined;

interface RevealEl extends HTMLElement {
  _revealStop?: () => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    mounted(el: RevealEl, binding) {
      const value = binding.value as RevealValue;
      const delay = typeof value === "number" ? value : (value?.delay ?? 0);
      const scale = typeof value === "object" ? !!value?.scale : false;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // A whisper of scale gives every reveal a premium sense of "settling"
      // into place rather than just sliding. Explicit scale:true is stronger.
      const fromScale = scale ? "scale(0.96)" : "scale(0.985)";

      // Hidden start state set inline so there is no flash before reveal.
      el.style.opacity = "0";
      el.style.transform = `translateY(18px) ${fromScale}`;
      el.style.willChange = "opacity, transform";

      if (reduce) {
        // No motion: snap to resting state immediately.
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
        return;
      }

      const stop = inView(
        el,
        () => {
          animate(
            el,
            {
              opacity: [0, 1],
              transform: [
                `translateY(18px) ${fromScale}`,
                "translateY(0px) scale(1)",
              ],
            },
            {
              duration: DURATION.slow,
              delay: delay / 1000,
              ease: EASE_ENTRANCE,
            },
          ).then(() => {
            el.style.willChange = "auto";
          });
          // Reveal once: stop observing after the first entry.
          el._revealStop?.();
        },
        { amount: 0.1, margin: "0px 0px -40px 0px" },
      );

      el._revealStop = stop;
    },
    unmounted(el: RevealEl) {
      el._revealStop?.();
      el._revealStop = undefined;
    },
  });
});
