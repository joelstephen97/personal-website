import { preloadWhisperModel } from "~/composables/useWhisperTranscriber";

export default defineNuxtPlugin(() => {
  preloadRouteComponents("/project/speech-to-text");
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => preloadWhisperModel(), { timeout: 3000 });
  } else {
    setTimeout(() => preloadWhisperModel(), 2000);
  }
});
