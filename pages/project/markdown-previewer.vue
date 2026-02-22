<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] px-6 py-12">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8 no-print">
        <div class="flex items-center gap-3">
          <BackToProjects />
          <h1 class="text-3xl font-bold text-[rgb(var(--foreground))]">Markdown Previewer</h1>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1.5 text-xs text-[rgb(var(--foreground-secondary))] cursor-pointer">
            <input v-model="autoSave" type="checkbox" /> Auto-save
          </label>
          <button class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-xs font-medium text-[rgb(var(--foreground-secondary))] hover:border-accent/50 transition-colors flex items-center gap-1" @click="copyHtml">
            <Icon :name="copied ? 'Check' : 'Copy'" :size="14" /> {{ copied ? 'Copied' : 'Copy HTML' }}
          </button>
          <button class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-xs font-medium text-[rgb(var(--foreground-secondary))] hover:border-accent/50 transition-colors flex items-center gap-1" @click="downloadMd">
            <Icon name="Download" :size="14" /> .md
          </button>
          <button class="px-3 py-2 rounded-lg bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-xs font-medium text-[rgb(var(--foreground-secondary))] hover:border-accent/50 transition-colors flex items-center gap-1" @click="exportPdf">
            <Icon name="FileDown" :size="14" /> PDF
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="glass-solid rounded-2xl px-4 py-2 mb-4 flex flex-wrap gap-1 no-print">
        <button v-for="tool in toolbar" :key="tool.label" class="w-8 h-8 rounded-lg hover:bg-[rgb(var(--glass))] flex items-center justify-center text-[rgb(var(--foreground-secondary))] hover:text-accent transition-colors" :title="tool.label" @click="tool.action">
          <Icon :name="tool.icon" :size="16" />
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="glass-solid rounded-2xl p-6 flex flex-col no-print">
          <div class="flex items-center justify-between mb-3">
            <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide">Editor</label>
            <span class="text-xs text-[rgb(var(--foreground-muted))]">
              {{ lineCount }} lines &middot; {{ wordCount }} words &middot; {{ charCount }} chars
            </span>
          </div>
          <textarea
            ref="editor"
            v-model="source"
            class="flex-1 min-h-[500px] px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-mono text-sm resize-none leading-relaxed"
            spellcheck="false"
            @keydown="onKeydown"
          />
        </div>

        <div class="glass-solid rounded-2xl p-6 flex flex-col">
          <label class="text-xs text-[rgb(var(--foreground-muted))] uppercase tracking-wide mb-3">Preview</label>
          <div
            class="flex-1 min-h-[500px] px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] overflow-auto prose-preview"
            v-html="rendered"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Markdown Previewer | Joel Stephen - Portfolio",
  description: "Split-pane editor with live preview powered by a hand-rolled parser.",
  path: "/project/markdown-previewer",
  breadcrumbTitle: "Markdown Previewer",
  projectSchema: {
    name: "Markdown Previewer",
    description: "Split-pane editor with live preview powered by a hand-rolled parser.",
  },
});

import { ref, computed } from "vue";
import { useClipboard, useStorage } from "@vueuse/core";
import DOMPurify from "dompurify";
import Icon from "~/components/ui/Icon.vue";

definePageMeta({ layout: "project-detail" });

const STORAGE_KEY = "markdown-previewer-content";
const DEFAULT_CONTENT = `# Hello World

This is a **markdown** previewer built with a _hand-rolled_ parser.

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- [Links](https://example.com)
- ![Images](https://via.placeholder.com/200x100)
- Inline \`code\` blocks
- Ordered and unordered lists
- Headings (h1-h6)
- Horizontal rules
- Blockquotes
- Tables

> This is a blockquote.
> It can span multiple lines.

### Code Block

\`\`\`
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Bold | Done |
| Tables | Done |
| Images | Done |

### Ordered List

1. First item
2. Second item
3. Third item

---

Built with zero dependencies.`;

const editor = ref<HTMLTextAreaElement | null>(null);
const { copy, copied } = useClipboard({ copiedDuring: 2000 });
const autoSave = useStorage("markdown-autosave", true);
const source = useStorage(STORAGE_KEY, DEFAULT_CONTENT);

function exportPdf() {
  window.print();
}

const lineCount = computed(() => source.value.split("\n").length);
const wordCount = computed(() => { const t = source.value.trim(); return t ? t.split(/\s+/).length : 0; });
const charCount = computed(() => source.value.length);

function wrapSelection(before: string, after: string) {
  const el = editor.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = source.value.slice(start, end);
  source.value = source.value.slice(0, start) + before + selected + after + source.value.slice(end);
  nextTick(() => { el.focus(); el.setSelectionRange(start + before.length, end + before.length); });
}

function insertAtCursor(text: string) {
  const el = editor.value;
  if (!el) return;
  const start = el.selectionStart;
  source.value = source.value.slice(0, start) + text + source.value.slice(start);
  nextTick(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length); });
}

const toolbar = [
  { label: "Bold (Ctrl+B)", icon: "Bold", action: () => wrapSelection("**", "**") },
  { label: "Italic (Ctrl+I)", icon: "Italic", action: () => wrapSelection("*", "*") },
  { label: "Strikethrough", icon: "Strikethrough", action: () => wrapSelection("~~", "~~") },
  { label: "Code", icon: "Code", action: () => wrapSelection("`", "`") },
  { label: "Link (Ctrl+K)", icon: "Link", action: () => wrapSelection("[", "](url)") },
  { label: "Image", icon: "Image", action: () => insertAtCursor("![alt](url)") },
  { label: "Heading", icon: "Heading", action: () => insertAtCursor("## ") },
  { label: "Quote", icon: "Quote", action: () => insertAtCursor("> ") },
  { label: "List", icon: "List", action: () => insertAtCursor("- ") },
  { label: "Horizontal Rule", icon: "Minus", action: () => insertAtCursor("\n---\n") },
];

function onKeydown(e: KeyboardEvent) {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === "b") { e.preventDefault(); wrapSelection("**", "**"); }
  if (mod && e.key === "i") { e.preventDefault(); wrapSelection("*", "*"); }
  if (mod && e.key === "k") { e.preventDefault(); wrapSelection("[", "](url)"); }
  if (e.key === "Tab") {
    e.preventDefault();
    insertAtCursor("  ");
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) return "#";
  return url;
}

function parseInline(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  result = result.replace(/_([^_]+)_/g, "<em>$1</em>");
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img src="${sanitizeUrl(src)}" alt="${escapeHtml(alt)}" style="max-width:100%;border-radius:8px" />`);
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `<a href="${escapeHtml(sanitizeUrl(url))}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  return result;
}

function parseTable(lines: string[], startIdx: number): { html: string; consumed: number } {
  const headerLine = lines[startIdx];
  const separatorLine = lines[startIdx + 1];
  if (!separatorLine || !/^\|[\s-:|]+\|$/.test(separatorLine.trim())) return { html: "", consumed: 0 };

  const parseRow = (line: string) => line.split("|").slice(1, -1).map((c) => c.trim());
  const headers = parseRow(headerLine);
  let html = "<table><thead><tr>" + headers.map((h) => `<th>${parseInline(h)}</th>`).join("") + "</tr></thead><tbody>";

  let i = startIdx + 2;
  while (i < lines.length && lines[i].trim().startsWith("|")) {
    const cells = parseRow(lines[i]);
    html += "<tr>" + cells.map((c) => `<td>${parseInline(c)}</td>`).join("") + "</tr>";
    i++;
  }
  html += "</tbody></table>";
  return { html, consumed: i - startIdx };
}

const rendered = computed(() => {
  const lines = source.value.split("\n");
  const html: string[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeContent: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) { codeContent.push(line); i++; continue; }
    if (line.trim() === "") { i++; continue; }

    if ((line.startsWith("---") || line.startsWith("***") || line.startsWith("___")) && line.trim().replace(/[-*_]/g, "") === "") {
      html.push("<hr>");
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length) {
      const { html: tableHtml, consumed } = parseTable(lines, i);
      if (consumed > 0) { html.push(tableHtml); i += consumed; continue; }
    }

    if (line.startsWith("> ") || line === ">") {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i] === ">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${quoteLines.map(parseInline).join("<br>")}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ""));
        i++;
      }
      html.push(`<ul>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      html.push(`<ol>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    html.push(`<p>${parseInline(line)}</p>`);
    i++;
  }

  if (inCodeBlock && codeContent.length) {
    html.push(`<pre><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`);
  }

  const raw = html.join("\n");
  return import.meta.client ? DOMPurify.sanitize(raw, { ALLOWED_TAGS: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "del", "code", "pre", "a", "img", "ul", "ol", "li", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td", "br"], ALLOWED_ATTR: ["href", "src", "alt", "target", "rel", "style"] }) : raw;
});

async function copyHtml() {
  await copy(rendered.value);
}

function downloadMd() {
  const blob = new Blob([source.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document.md";
  a.click();
  URL.revokeObjectURL(url);
}

function nextTick(fn: () => void) { setTimeout(fn, 0); }
</script>

<style scoped>
.prose-preview :deep(h1) { font-size: 2em; font-weight: 700; margin: 0.67em 0; color: rgb(var(--foreground)); }
.prose-preview :deep(h2) { font-size: 1.5em; font-weight: 700; margin: 0.83em 0; color: rgb(var(--foreground)); }
.prose-preview :deep(h3) { font-size: 1.17em; font-weight: 700; margin: 1em 0; color: rgb(var(--foreground)); }
.prose-preview :deep(h4) { font-size: 1em; font-weight: 700; margin: 1.33em 0; color: rgb(var(--foreground)); }
.prose-preview :deep(p) { margin: 0.5em 0; color: rgb(var(--foreground-secondary)); line-height: 1.7; }
.prose-preview :deep(strong) { color: rgb(var(--foreground)); font-weight: 600; }
.prose-preview :deep(em) { font-style: italic; }
.prose-preview :deep(del) { text-decoration: line-through; opacity: 0.6; }
.prose-preview :deep(a) { color: rgb(var(--accent)); text-decoration: underline; }
.prose-preview :deep(code) { background: rgb(var(--glass)); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.85em; font-family: 'SF Mono', monospace; }
.prose-preview :deep(pre) { background: rgb(var(--glass)); padding: 1em; border-radius: 0.75rem; overflow-x: auto; margin: 1em 0; }
.prose-preview :deep(pre code) { background: none; padding: 0; font-size: 0.85em; }
.prose-preview :deep(blockquote) { border-left: 3px solid rgb(var(--accent)); padding-left: 1em; margin: 1em 0; color: rgb(var(--foreground-secondary)); }
.prose-preview :deep(ul), .prose-preview :deep(ol) { padding-left: 1.5em; margin: 0.5em 0; color: rgb(var(--foreground-secondary)); }
.prose-preview :deep(li) { margin: 0.25em 0; }
.prose-preview :deep(hr) { border: none; border-top: 1px solid rgb(var(--border)); margin: 1.5em 0; }
.prose-preview :deep(ul) { list-style-type: disc; }
.prose-preview :deep(ol) { list-style-type: decimal; }
.prose-preview :deep(table) { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.875em; }
.prose-preview :deep(th), .prose-preview :deep(td) { border: 1px solid rgb(var(--border)); padding: 0.5em 0.75em; text-align: left; }
.prose-preview :deep(th) { background: rgb(var(--glass)); font-weight: 600; color: rgb(var(--foreground)); }
.prose-preview :deep(td) { color: rgb(var(--foreground-secondary)); }
.prose-preview :deep(img) { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }

@media print {
  .no-print { display: none !important; }
}
</style>
