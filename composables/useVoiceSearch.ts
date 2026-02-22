const RECORD_DURATION_MS = 1000;

function extractText(result: unknown): string {
  if (typeof result === "string") return result.trim();
  if (result && typeof result === "object" && "text" in result) {
    const t = (result as { text?: unknown }).text;
    return typeof t === "string" ? t.trim() : "";
  }
  if (Array.isArray(result) && result[0] && typeof result[0] === "object" && "text" in result[0]) {
    const t = (result[0] as { text?: unknown }).text;
    return typeof t === "string" ? t.trim() : "";
  }
  return "";
}

export function useVoiceSearch(
  searchQueryRef: Ref<string>,
  options?: { manualStop?: boolean }
) {
  const manualStop = options?.manualStop ?? false;
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];
  let stopTimeoutId: ReturnType<typeof setTimeout> | null = null;
  const whisper = useWhisperTranscriber();
  const { loadError: loadErrorRef, isReady, initPipeline } = whisper;
  const localError = ref("");
  const isListening = ref(false);
  const isProcessing = ref(false);

  function stopRecording() {
    if (stopTimeoutId) {
      clearTimeout(stopTimeoutId);
      stopTimeoutId = null;
    }
    if (mediaRecorder?.state !== "inactive") {
      mediaRecorder.stop();
    }
    isListening.value = false;
  }

  async function startRecording() {
    if (isListening.value || isProcessing.value) return;
    localError.value = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        isListening.value = false;
        if (recordedChunks.length) {
          isProcessing.value = true;
          const blob = new Blob(recordedChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          (async () => {
            try {
              await initPipeline();
              const fn = whisper.transcriber;
              if (!fn) {
                localError.value = "Transcription model not ready";
                return;
              }
              const result = await fn(url);
              const text = extractText(result);
              localError.value = "";
              await nextTick();
              searchQueryRef.value = text;
            } catch (e) {
              localError.value =
                e instanceof Error ? e.message : "Transcription failed";
            } finally {
              URL.revokeObjectURL(url);
              isProcessing.value = false;
            }
          })();
        }
      };
      mediaRecorder.start();
      isListening.value = true;
      if (!manualStop) {
        stopTimeoutId = setTimeout(() => {
          stopTimeoutId = null;
          if (mediaRecorder?.state !== "inactive") {
            mediaRecorder.stop();
          }
        }, RECORD_DURATION_MS);
      }
    } catch {
      localError.value = "Microphone access denied";
    }
  }

  const loadError = computed(() => loadErrorRef.value || localError.value);

  return {
    isListening,
    isProcessing,
    loadError,
    isModelReady: isReady,
    startRecording,
    stopRecording,
  };
}
