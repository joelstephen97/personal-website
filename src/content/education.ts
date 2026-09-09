import { Education } from "./schema";

export const education = Education.parse({
  degree: "Bachelor of Engineering in Computer Science Engineering, Hons.",
  institution: "BITS Pilani, Dubai Campus",
  location: "Dubai, UAE",
  dates: { start: "2015", end: "2019" },
  capstone:
    "TensorFlow and Python stock-price prediction, from data to model to operational signal.",
  certifications: {
    summary: "Sixteen listed on LinkedIn.",
    inProgress: "AWS Cloud Practitioner in progress.",
  },
});
