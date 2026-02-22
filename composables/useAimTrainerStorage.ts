import type { AimTrainerRun } from "~/composables/useAimTrainer";

const STORAGE_KEY = "aim-trainer-runs";
const MAX_RUNS = 30;

export function useAimTrainerStorage() {
  const runs = ref<AimTrainerRun[]>([]);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AimTrainerRun[];
        runs.value = Array.isArray(parsed) ? parsed : [];
      } else {
        runs.value = [];
      }
    } catch {
      runs.value = [];
    }
  }

  function save(run: AimTrainerRun) {
    const list = [run, ...runs.value].slice(0, MAX_RUNS);
    runs.value = list;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      runs.value = list.slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runs.value));
    }
  }

  function clear() {
    runs.value = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  onMounted(load);

  return { runs, load, save, clear };
}
