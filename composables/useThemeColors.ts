/**
 * Returns theme colors from CSS variables for use in canvas/SVG or other non-CSS contexts.
 */
export function useThemeColors() {
  function getVar(name: string): string {
    if (import.meta.server) return "";
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  function rgbVar(name: string): string {
    const val = getVar(name);
    if (!val) return "rgb(0, 122, 255)";
    return `rgb(${val})`;
  }

  function accentRgba(alpha: number): string {
    const val = getVar("--accent");
    if (!val) return `rgba(0, 122, 255, ${alpha})`;
    const rgb = val.replace(/\s+/g, ", ");
    return `rgba(${rgb}, ${alpha})`;
  }

  return {
    bg: () => rgbVar("--bg"),
    accent: () => rgbVar("--accent"),
    accentHover: () => rgbVar("--accent-hover"),
    accentRgba,
  };
}
