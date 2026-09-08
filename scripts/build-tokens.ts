import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("src/styles", { recursive: true });
writeFileSync("src/styles/tokens.css", "/* generated */\n");
