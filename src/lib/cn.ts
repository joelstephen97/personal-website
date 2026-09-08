export type ClassValue = string | false | undefined | null;

/** Minimal class-name joiner: filters out falsy values, no dependency. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
