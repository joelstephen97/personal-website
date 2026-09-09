import { Domain } from "./schema";

export const domains = Domain.array().parse([
  {
    id: "ai",
    label: "AI",
    short: "LLM pipelines, RAG, and on-device detection.",
    angle: -90,
    blurb:
      "Building software that puts a model to work inside a product: situation-based pipelines instead of one big prompt, retrieval where the model needs context it does not have, voice output, and detection models small enough to run on-device.",
    tech: [
      "Anthropic API",
      "OpenAI API",
      "situation-based pipelines",
      "RAG",
      "ElevenLabs TTS",
      "on-device ML",
    ],
    work: ["process-discovery", "workflow-canvas", "scamshield"],
    experience: ["appliedai"],
  },
  {
    id: "realtime",
    label: "Real-Time",
    short: "CRDTs, conflict resolution, and live collaboration.",
    angle: -30,
    blurb:
      "Multiple people editing the same canvas at once: conflict-free replicated data types where they fit, custom conflict resolution when a generic library stops scaling, presence, and versioning.",
    tech: ["Yjs/CRDT", "custom conflict resolution", "WebSocket", "SSE", "presence", "versioning"],
    work: ["process-discovery"],
    experience: ["appliedai"],
  },
  {
    id: "interfaces",
    label: "Interfaces",
    short: "Node-graph editors and canvas rendering at scale.",
    angle: 30,
    blurb:
      "Editors and canvases that stay fast under real graphs: node-graph editing, custom canvas rendering, expression engines, undo and redo, virtualised lists, and the specific performance work that large graphs demand.",
    tech: [
      "node-graph editors",
      "canvas rendering",
      "expression engines",
      "undo/redo",
      "virtualised lists",
      "large-graph performance",
    ],
    work: ["workflow-canvas", "process-discovery", "customer-surface"],
    experience: ["appliedai"],
  },
  {
    id: "product",
    label: "Product",
    short: "Production UI in React, Next.js, and Vue.",
    angle: 90,
    blurb:
      "Shipping the surface a customer actually touches: React and Next.js, Vue and Nuxt, TypeScript throughout, Zustand for state, designs taken from Figma into production, and a couple of progressive web apps along the way.",
    tech: [
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "TypeScript",
      "Zustand",
      "Figma-to-production",
      "PWA",
    ],
    work: ["customer-surface", "flower-meister", "fmi-platform", "scamshield"],
    experience: ["appliedai", "otani-senior", "otani-swe", "riot"],
  },
  {
    id: "python",
    label: "Python",
    short: "APIs, data models, and backend services.",
    angle: 150,
    blurb:
      "The backend half of a product: FastAPI and Django services, Pydantic and Peewee models, Strawberry GraphQL, DynamoDB and Postgres, with Pytest keeping it honest.",
    tech: [
      "FastAPI",
      "Django",
      "Pydantic",
      "Strawberry GraphQL",
      "Peewee",
      "DynamoDB",
      "Postgres",
      "Pytest",
    ],
    work: ["fmi-platform", "flower-meister", "process-discovery"],
    experience: ["appliedai", "otani-senior", "otani-swe"],
  },
  {
    id: "cv",
    label: "Computer Vision",
    short: "Detection and tracking with trained models.",
    angle: 210,
    blurb:
      "Training and running vision models for a real product: YOLO v5 for detection, OpenCV for tracking, and TensorFlow for a capstone stock-price model back at university.",
    tech: ["YOLO v5", "OpenCV", "TensorFlow"],
    work: ["flower-meister"],
    experience: ["otani-senior"],
  },
]);
