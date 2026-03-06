<template>
  <div class="min-h-screen bg-background px-6 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-8">
        <BackToProjects />
        <h1 class="text-3xl font-bold text-foreground">
          Local File Editor
        </h1>
      </div>

      <p class="text-muted-foreground mb-8">
        Edit text files directly on your disk. Uses the File System Access
        API—no uploads, files stay local.
      </p>

      <div v-if="!isSupported" class="glass-solid rounded-2xl p-8 text-center">
        <p class="text-amber-600">
          File System Access API is not supported. Try Chrome or Edge.
        </p>
      </div>

      <template v-else>
        <div class="glass-solid rounded-2xl p-6 mb-6">
          <div class="flex flex-wrap gap-3 mb-4">
            <button
              class="px-5 py-3 rounded-xl bg-glass border border-border font-medium flex items-center gap-2 hover:border-accent/50 transition"
              @click="openFile"
            >
              <Icon name="FolderOpen" :size="18" /> Open
            </button>
            <button
              class="px-5 py-3 rounded-xl bg-glass border border-border font-medium flex items-center gap-2 hover:border-accent/50 transition"
              @click="createFile"
            >
              <Icon name="FilePlus" :size="18" /> New
            </button>
            <button
              :disabled="!hasFile"
              class="px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition disabled:opacity-50"
              :class="
                hasFile
                  ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25'
                  : 'bg-glass border border-border'
              "
              @click="saveFile"
            >
              <Icon name="Save" :size="18" /> Save
            </button>
            <button
              v-if="hasFile"
              class="px-5 py-3 rounded-xl bg-glass border border-border font-medium flex items-center gap-2 hover:border-accent/50 transition"
              @click="saveFileAs"
            >
              <Icon name="FileDown" :size="18" /> Save As
            </button>
          </div>

          <p
            v-if="fileName"
            class="text-sm text-muted-foreground mb-2"
          >
            {{ fileName }}
          </p>

          <textarea
            v-model="editContent"
            class="w-full h-96 px-4 py-3 rounded-xl bg-glass border border-border text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            placeholder="Open a file or create a new one..."
            spellcheck="false"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFileSystemAccess } from "@vueuse/core";
import Icon from "~/components/ui/Icon.vue";

useSeo({
  title: "Local File Editor | Joel Stephen - Portfolio",
  description: "Edit text files directly on disk via File System Access API.",
  path: "/project/local-file-editor",
  breadcrumbTitle: "Local File Editor",
  projectSchema: {
    name: "Local File Editor",
    description: "Edit text files directly on disk via File System Access API.",
  },
});

definePageMeta({ layout: "project-detail" });

const { isSupported, data, file, fileName, open, create, save, saveAs } =
  useFileSystemAccess({
    dataType: "Text",
    types: [
      {
        description: "Text files",
        accept: { "text/plain": [".txt", ".md", ".json", ".csv", ".log"] },
      },
    ],
  });

const editContent = computed({
  get: () => data.value ?? "",
  set: (v) => {
    data.value = v;
  },
});

const hasFile = computed(() => !!file.value);

async function openFile() {
  await open();
}

async function createFile() {
  await create({ suggestedName: "untitled.txt" });
  data.value = "";
}

async function saveFile() {
  await save();
}

async function saveFileAs() {
  await saveAs({ suggestedName: fileName.value || "untitled.txt" });
}
</script>
