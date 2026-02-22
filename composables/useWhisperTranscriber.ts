import { getTransformers } from "./useTransformersClient";

let transcriberFn: ((url: string) => Promise<{ text: string }>) | null = null;
const loadError = ref("");
const isReady = ref(false);

async function initPipeline() {
  if (transcriberFn) return;
  try {
    const { pipeline } = await getTransformers();
    const model = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en",
    );
    transcriberFn = model as (url: string) => Promise<{ text: string }>;
    isReady.value = true;
  } catch (e) {
    loadError.value =
      e instanceof Error ? e.message : "Failed to load Whisper model";
  }
}

export function useWhisperTranscriber() {
  return {
    get transcriber() {
      return transcriberFn;
    },
    loadError,
    isReady,
    initPipeline,
  };
}

export function preloadWhisperModel() {
  initPipeline();
}
