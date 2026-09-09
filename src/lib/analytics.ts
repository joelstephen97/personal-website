import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent =
  | "resume_click"
  | "consulting_cta_click"
  | "email_copy"
  | "github_click"
  | "linkedin_click"
  | "extension_install_click"
  | "case_study_view"
  | "map_select"
  | "palette_open"
  | "palette_command"
  | "lab_run";

/** Thin, typed wrapper around `@vercel/analytics`'s `track`. */
export function track(event: AnalyticsEvent, props?: Record<string, string>): void {
  vercelTrack(event, props);
}
