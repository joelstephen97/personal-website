import { Principle } from "./schema";

export const principles = Principle.array().parse([
  {
    title: "Fork what is proven, rewrite what is yours.",
    detail:
      "Opus's workflow-builder canvas started as a fork of an open-source workflow engine. Keeping what already worked and rewriting the rest was faster than either starting from zero or living with someone else's ceiling.",
  },
  {
    title: "A generic library solves a generic problem.",
    detail:
      "Process Discovery was built on Yjs. Once real customer graphs pushed past what a generic CRDT library was built for, the fix was a custom conflict-resolution engine, not a bigger workaround.",
  },
  {
    title: "The model needs the context the user has.",
    detail:
      "A single prompt runs out of context fast. Situation-based pipelines and retrieval exist to hand the model the specific facts a person already has in front of them.",
  },
  {
    title: "Prototype the UI before spending backend budget.",
    detail:
      "Flower Meister's screens were validated in Figma before a line of backend code existed, so the build phase spent its budget on the parts that were already agreed on.",
  },
  {
    title: "Ship the detection where the data already is.",
    detail:
      "ScamShield scores every page on-device, in the browser, instead of round-tripping it to a server: the data is already there, and the decision needs to happen before the page loads.",
  },
  {
    title: "Sit in the customer call.",
    detail:
      "Presales and customer-success calls surface the failure modes a backlog never will. Sitting in on them directly keeps the roadmap tied to what customers actually hit.",
  },
]);
