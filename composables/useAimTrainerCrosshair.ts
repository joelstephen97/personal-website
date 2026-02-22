import { useStorage } from "@vueuse/core";

export type CrosshairStyle = "cross" | "dot" | "circle" | "cross-dot";

export interface CrosshairSettings {
  style: CrosshairStyle;
  size: number;
  thickness: number;
  gap: number;
  color: string;
  outline: boolean;
  outlineColor: string;
}

const DEFAULT: CrosshairSettings = {
  style: "cross",
  size: 16,
  thickness: 2,
  gap: 2,
  color: "#dc2626",
  outline: true,
  outlineColor: "#000000",
};

const STORAGE_KEY = "aim-trainer-crosshair";

export function useAimTrainerCrosshair() {
  const settings = useStorage<CrosshairSettings>(STORAGE_KEY, DEFAULT);
  return { settings };
}
