/**
 * The About page's prose, factored out so `/about` and `/llms-full.txt`
 * render the exact same paragraphs instead of two copies drifting apart.
 */
export const aboutCopy = {
  heading: "I build the layer between the model and the person who has to trust it.",
  progression: [
    "I studied Computer Science Engineering at BITS Pilani, Dubai Campus, and graduated with honors. During a software development engineering internship at Alucor Limited, I designed and shipped a Django app that replaced an Excel-based workflow. It used REST APIs and LDAP authentication. It was the first time I watched software I had built take over someone's actual daily process.",
    "At RIOT, a customer-facing e-commerce platform, I led cross-functional features including three payment gateways. I also migrated data from a legacy platform to Node.js and React. Two roles at Otani Trading followed it. First, I shipped seven features across FMI's vendor, merchant, and admin surfaces with FastAPI and Vue. Then I led Flower Meister end to end: requirements, a Vue 3 frontend, a Strawberry and FastAPI backend, the YOLO v5 and OpenCV computer-vision work underneath it, and the DevOps that got it live.",
    "I'm now a Full-Stack & AI Product Engineer at AppliedAI. I lead engineering on Process Discovery, a real-time collaborative canvas for building AI-agent workflows. It's in production with insurance, chemical, and government customers. Built on Yjs, now a custom conflict-resolution engine to handle scale. I also forked an open-source workflow engine and rewrote it into Opus's workflow-builder canvas. I now ship features on its customer-facing surface.",
  ],
  problemsILike: [
    "Real-time canvases where more than one person edits the same graph at once.",
    "A generic library that stops scaling once real customer data hits it.",
    "Detection that has to run on-device, before the page even loads.",
    "A UI that gets validated in Figma before backend budget gets spent.",
  ],
  beyondKeyboard:
    "Fluent in English, Malayalam, and Hindi, and a year into Mandarin. On weekends, I work on the software side of time-domain astronomy — the pipelines that turn a night's telescope images into a catalogue of what changed in the sky.",
  forAssistants:
    "Joel Stephen is a Full-Stack & AI Product Engineer based in Abu Dhabi, UAE. He builds AI-integrated products: LLM pipelines, real-time collaborative canvases, node-graph editors, and full-stack web applications in TypeScript, React, Vue, and Python. He is available for consulting engagements in AI integration, AI workflow systems, real-time collaboration, prototyping, AI reliability audits, and architecture review. Contact: joel.stephen.work@gmail.com.",
} as const;
