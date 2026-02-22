import { preloadWhisperModel } from "~/composables/useWhisperTranscriber";

export default defineNuxtPlugin(() => {
  preloadRouteComponents("/project/speech-to-text");
  preloadWhisperModel();
});
