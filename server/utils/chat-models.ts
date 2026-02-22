export interface ChatModel {
  id: string;
  name: string;
  modelId: string;
}

export const CHAT_MODELS: ChatModel[] = [
  { id: "groq-llama-8b", name: "Llama 3.1 8B", modelId: "llama-3.1-8b-instant" },
  { id: "groq-llama-70b", name: "Llama 3.3 70B", modelId: "llama-3.3-70b-versatile" },
  { id: "groq-gpt-oss-20b", name: "GPT OSS 20B", modelId: "openai/gpt-oss-20b" },
  { id: "groq-gpt-oss-120b", name: "GPT OSS 120B", modelId: "openai/gpt-oss-120b" },
];

export const DEFAULT_CHAT_MODEL_ID = "groq-llama-70b";

export const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
