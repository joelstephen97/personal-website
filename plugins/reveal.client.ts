export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    mounted(el: HTMLElement, binding) {
      const value = binding.value ?? {};
      const delay =
        typeof value === "number" ? value : (value.delay ?? 0);

      el.classList.add("reveal");
      if (value.scale) el.classList.add("reveal--scale");
      el.style.setProperty("--reveal-delay", `${delay}ms`);

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("revealed");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );

      observer.observe(el);

      (el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver = observer;
    },
    unmounted(el: HTMLElement) {
      const observer = (el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver;
      if (observer) {
        observer.unobserve(el);
        observer.disconnect();
      }
    },
  });
});
