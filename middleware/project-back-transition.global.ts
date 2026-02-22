export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/project" && from.path.startsWith("/project/")) {
    if (import.meta.client) sessionStorage.setItem("project-list-returning", "1");
    const match = from.path.match(/\/project\/([^/]+)/);
    if (match) {
      const { setActiveTransitionSlug } = useProjectTransition();
      setActiveTransitionSlug(match[1]);
    }
  }
});
