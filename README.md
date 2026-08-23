# personal-website

My portfolio site: https://joelstephen.vercel.app. A Nuxt 3 single-page app with my experience and work pages, 19 interactive side projects that run entirely in the browser, and a chat agent that answers questions about me using Groq.

![Vue](https://img.shields.io/badge/Nuxt-3-00DC82) ![License](https://img.shields.io/badge/license-MIT-green)

## Why

I started this in mid-2024 as a plain portfolio and kept adding to it: the project pages became a place to try browser-side ML (Transformers.js, TensorFlow.js, Whisper), the Web APIs I wanted to learn (View Transitions, Web Share, EyeDropper, Screen Capture, File System Access), and in 2026 an LLM chat that recruiters can ask about my background instead of reading the whole site. It doubles as my playground for motion design (motion-v) and a glassmorphism design system on Tailwind.

## What is on the site

- Home, About, Experience, Work (case studies), Contact (EmailJS form), resume PDF.
- Projects: aim trainer, pathfinding and sorting visualizers, Game of Life, regex tester, JSON diff, cron parser, hash generator, colour palette, markdown previewer, audio visualiser, eye dropper, screen capture and annotation, local file editor, R6 Siege operator randomiser, plus three ML demos that run in-browser with no server: background remover (BodyPix), image captioning (Transformers.js) and speech to text (Whisper).
- "Ask about Joel" chat agent, see below.
- PWA install, dark mode, sitemap, OG/Twitter meta, CSP headers, Vercel Analytics.

## The chat agent

`server/api/chat.post.ts` is a Nitro route that forwards the conversation to Groq's OpenAI-compatible endpoint (`llama-3.3-70b-versatile` by default; the list is in `server/utils/chat-models.ts`) with a system prompt built from:

- `server/utils/joel-context.ts`: a long plain-text dossier about my experience, projects, skills and preferences. The model is told to answer only from this and to say so when something is not in it.
- `server/utils/chat-personalities.ts`: three voices the visitor can pick (Yoda, Tony Stark, Dr. House) wrapped around the same grounding and refusal rules.
- `server/utils/chat-guardrails.ts`: regex-based detection of prompt-injection attempts, input sanitising, XML-escaping of user text inside `<untrusted_user_input>` tags, and a check on the model's output before it is returned.

The client side is `composables/useJoelAgent.ts` and `components/JoelAgentChat.vue`: message history in localStorage, personality selection, a typing animation. Responses are capped at 512 tokens, temperature 0.5. If `GROQ_API_KEY` is not set the endpoint returns 503 and the chat shows it is unavailable.

## Quickstart

Requires Node 20+ and pnpm.

```bash
git clone https://github.com/joelstephen97/personal-website.git
cd personal-website
pnpm install
cp .env.example .env      # then put your Groq key in GROQ_API_KEY
pnpm dev
```

Open http://localhost:3000. Everything except the chat works without any keys. A free Groq key from https://console.groq.com enables the chat.

`pnpm dev` runs Node with a 12 GB heap because the ML dependencies are large; lower `--max-old-space-size` in `package.json` if your machine has less RAM.

## Scripts

```bash
pnpm dev        # dev server
pnpm build      # production build (Vercel preset in production, prerenders the listed routes)
pnpm generate   # full static generation
pnpm preview    # serve the build locally
pnpm lint       # eslint + prettier check
pnpm lintfix    # fix both
pnpm pwa:generate   # regenerate PWA icons from public/icon.svg
```

## Deploy on Vercel

Import the repo in Vercel, framework preset Nuxt, build command `pnpm build`. Add environment variables:

| Variable                                                  | Purpose                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `GROQ_API_KEY`                                            | required for the chat agent                                             |
| `NUXT_PUBLIC_SITE_URL`                                    | canonical URL for sitemap and meta (defaults to joelstephen.vercel.app) |
| `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION`                    | optional Search Console meta tag                                        |
| `NUXT_PUBLIC_TWITTER_CREATOR`, `NUXT_PUBLIC_TWITTER_SITE` | optional card attribution                                               |

## How it works

- `ssr: false`: the app is a client-rendered SPA, with the main routes prerendered to static HTML by Nitro so crawlers get real markup. The chat route is the only server code.
- Design tokens are CSS variables in `assets/css/main.css`, registered as Tailwind colours in `tailwind.config.js`; components use semantic classes (`bg-glass`, `text-foreground`).
- Browser ML goes through `composables/useTransformersClient.ts` (lazy import of `@huggingface/transformers`, models fetched from the Hugging Face CDN on first use).
- Security: CSP and other headers in `nuxt.config.ts` `routeRules`, Trusted Types via a DOMPurify plugin, sanitised chat input on the server.

## Project structure

```
pages/            routes (about, experience, work/*, project/*, contact)
components/       UI, aim-trainer/, JoelAgentChat, motion pieces
composables/      useJoelAgent, useSeo, useTransformersClient, useWhisperTranscriber, ...
server/api/       chat.post.ts (Groq proxy)
server/utils/     joel-context, chat-personalities, chat-guardrails, chat-models
layouts/          default, project-detail
plugins/          trusted-types, vercel analytics, whisper preload
assets/           main.css, work images
public/           icons, resume PDF, llms.txt, robots.txt
```

## Status and limitations

- Live and maintained; it is my current portfolio.
- The chat is only as accurate as `joel-context.ts`, which I update by hand. Guardrails are regex heuristics plus prompt rules, not a guarantee.
- The ML demos download model weights (tens to hundreds of MB) on first use and need a modern browser with WebGL or WASM.
- The contact form uses an EmailJS public key that is mine; swap it in `pages/contact.vue` if you fork this.
- Not set up for `npm`; the lockfile is pnpm's.

## License

MIT, see [LICENSE](LICENSE). The content about me (text, images, resume) is not covered by the license.
