<template>
  <div class="max-w-5xl mx-auto px-6 py-20">
    <div class="grid lg:grid-cols-2 gap-16">
      <!-- Left -->
      <div>
        <p
          class="text-sm font-medium text-red-500 tracking-wide uppercase mb-4"
        >
          Get in Touch
        </p>
        <h1
          class="text-4xl md:text-5xl font-bold text-[rgb(var(--foreground))] mb-4"
        >
          Contact
        </h1>
        <p class="text-lg text-[rgb(var(--foreground-secondary))] mb-8">
          Have a project in mind? Let's talk.
        </p>

        <div class="space-y-4">
          <a
            v-for="info in contactInfo"
            :key="info.label"
            :href="info.href"
            :target="info.external ? '_blank' : undefined"
            class="flex items-center gap-4 p-4 rounded-xl glass-solid hover:border-red-500/30 transition-all group"
          >
            <div
              class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"
            >
              <Icon :name="info.icon" :size="20" class="text-red-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-medium text-[rgb(var(--foreground-muted))] uppercase tracking-wide"
              >
                {{ info.label }}
              </p>
              <p
                class="text-sm font-medium text-[rgb(var(--foreground))] group-hover:text-red-500 transition-colors truncate"
              >
                {{ info.value }}
              </p>
            </div>
            <Icon
              v-if="info.external"
              name="ArrowUpRight"
              :size="18"
              class="text-[rgb(var(--foreground-muted))] group-hover:text-red-500"
            />
          </a>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="glass-solid rounded-2xl p-8">
        <h2 class="text-xl font-semibold text-red-500 mb-6">Send a Message</h2>

        <form class="space-y-5" @submit.prevent="submit">
          <div>
            <label
              class="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))] focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))] focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
              >Message</label
            >
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="Your message..."
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))] focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition resize-none"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-[rgb(var(--foreground))] mb-2"
              >{{ captcha.q }}</label
            >
            <input
              v-model="form.captcha"
              type="text"
              placeholder="Answer"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--foreground-muted))] focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition"
            />
          </div>
          <button
            type="submit"
            :disabled="sending"
            class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name="Send" :size="18" />
            {{ sending ? "Sending..." : "Send Message" }}
          </button>
        </form>

        <Transition
          enter-active-class="transition"
          enter-from-class="opacity-0 translate-y-2"
        >
          <div
            v-if="success"
            class="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-600"
          >
            <Icon name="CheckCircle" :size="18" />
            <span class="text-sm font-medium">Message sent successfully!</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Icon from "~/components/ui/Icon.vue";

declare global {
  interface Window {
    emailjs: unknown;
  }
}

const contactInfo = [
  {
    label: "Email",
    value: "joel.stephen.work@gmail.com",
    icon: "Mail",
    href: "mailto:joel.stephen.work@gmail.com",
  },
  {
    label: "WhatsApp",
    value: "Message me",
    icon: "MessageCircle",
    href: "https://wa.me/+971568098085",
    external: true,
  },
  {
    label: "Location",
    value: "Abu Dhabi, UAE",
    icon: "MapPin",
    href: "https://maps.google.com/?q=Abu+Dhabi",
    external: true,
  },
];

const captchas = [
  { q: "What is 2 + 3?", a: "5" },
  { q: "What is 4 + 5?", a: "9" },
  { q: "What is 7 - 2?", a: "5" },
];
const captcha = captchas[Math.floor(Math.random() * captchas.length)];

const form = reactive({ name: "", email: "", message: "", captcha: "" });
const sending = ref(false);
const success = ref(false);

onMounted(() => {
  if (!document.getElementById("emailjs")) {
    const s = document.createElement("script");
    s.id = "emailjs";
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload = () => window.emailjs.init("HZeS1ehR96UvqjMx_");
    document.body.appendChild(s);
  }
});

async function submit() {
  if (form.captcha !== captcha.a) return;
  sending.value = true;
  try {
    await window.emailjs.send("service_dnizv9b", "template_bkiydiu", {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    });
    success.value = true;
    form.name = form.email = form.message = form.captcha = "";
  } catch {
    /* handle error */
  }
  sending.value = false;
}
</script>
