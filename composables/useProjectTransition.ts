const activeTransitionSlug = ref<string | null>(null);

export function useProjectTransition() {
  function setActiveTransitionSlug(slug: string | null) {
    activeTransitionSlug.value = slug;
  }

  function clearActiveTransitionSlug() {
    activeTransitionSlug.value = null;
  }

  return {
    activeTransitionSlug: readonly(activeTransitionSlug),
    setActiveTransitionSlug,
    clearActiveTransitionSlug,
  };
}
