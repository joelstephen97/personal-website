/**
 * Client-only wrapper for @huggingface/transformers.
 * Centralizes imports and env config. Use this instead of importing directly.
 */

let configApplied = false;

function applyEnvConfig(env: { backends?: { onnx?: unknown } }) {
  if (configApplied || !env?.backends?.onnx) return;
  const onnx = env.backends.onnx as {
    logLevel?: string;
    webgpu?: { powerPreference?: string };
  };
  onnx.logLevel = "error";
  if (onnx.webgpu) delete onnx.webgpu.powerPreference;
  configApplied = true;
}

export async function getTransformers() {
  if (import.meta.server) {
    throw new Error("Transformers only available on client");
  }
  const mod = await import("@huggingface/transformers");
  applyEnvConfig(mod.env);
  return mod;
}
