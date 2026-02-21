<template>
  <div class="max-w-5xl mx-auto px-6 py-20">
    <div class="grid lg:grid-cols-2 gap-16">
      <!-- Left -->
      <section aria-labelledby="contact-heading">
        <p
          class="text-sm font-medium text-accent tracking-wide uppercase mb-4"
        >
          Get in Touch
        </p>
        <h1
          id="contact-heading"
          class="text-h1 font-bold text-foreground mb-4"
        >
          Contact
        </h1>
        <p class="text-lg text-muted mb-8">
          Have a project in mind? Let's talk.
        </p>

        <div class="space-y-4">
          <a
            v-for="info in contactInfo"
            :key="info.label"
            :href="info.href"
            :target="info.external ? '_blank' : undefined"
            class="flex items-center gap-4 p-4 rounded-xl glass-solid hover:border-accent/30 transition-all group"
          >
            <div
              class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"
            >
              <Icon :name="info.icon" :size="20" class="text-accent" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {{ info.label }}
              </p>
              <p
                class="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate"
              >
                {{ info.value }}
              </p>
            </div>
            <Icon
              v-if="info.external"
              name="ArrowUpRight"
              :size="18"
              class="text-muted-foreground group-hover:text-accent"
            />
          </a>
        </div>
      </section>

      <!-- Right: Form -->
      <section class="glass-solid rounded-2xl p-8" aria-labelledby="form-heading">
        <h2 id="form-heading" class="text-h3 font-semibold text-accent mb-6">Send a Message</h2>

        <form class="space-y-5" @submit.prevent="submit">
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-2"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-2"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-2"
              >Message</label
            >
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="Your message..."
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-foreground mb-2"
              >{{ captcha.q }}</label
            >
            <input
              v-model="form.captcha"
              type="text"
              placeholder="Answer"
              class="w-full px-4 py-3 rounded-xl bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <button
            type="submit"
            :disabled="sending || !emailjsReady"
            class="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name="Send" :size="18" />
            {{
              !emailjsReady
                ? "Loading..."
                : sending
                  ? "Sending..."
                  : "Send Message"
            }}
          </button>
        </form>

        <Transition
          enter-active-class="transition"
          enter-from-class="opacity-0 translate-y-2"
        >
          <div
            v-if="success"
            class="mt-4 p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-2 text-success"
          >
            <Icon name="CheckCircle" :size="18" />
            <span class="text-sm font-medium">Message sent successfully!</span>
          </div>
        </Transition>
        <Transition
          enter-active-class="transition"
          enter-from-class="opacity-0 translate-y-2"
        >
          <div
            v-if="error"
            class="mt-4 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-error"
          >
            <Icon name="CircleAlert" :size="18" />
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
        </Transition>
      </section>
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
const error = ref<string | null>(null);
const emailjsReady = ref(false);

onMounted(() => {
  if (document.getElementById("emailjs")) {
    emailjsReady.value = true;
    return;
  }
  const s = document.createElement("script");
  s.id = "emailjs";
  s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  s.onload = () => {
    window.emailjs.init({ publicKey: "HZeS1ehR96UvqjMx_" });
    emailjsReady.value = true;
  };
  document.body.appendChild(s);
});

async function submit() {
  if (form.captcha !== captcha.a) return;
  if (!emailjsReady.value || !window.emailjs) return;
  sending.value = true;
  error.value = null;
  try {
    await window.emailjs.send("service_psja64o", "template_bkiydiu", {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    });
    success.value = true;
    form.name = form.email = form.message = form.captcha = "";
  } catch (err) {
    error.value = "Failed to send. Please try again or email directly.";
    success.value = false;
    if (import.meta.dev) console.error("EmailJS error:", err);
  } finally {
    sending.value = false;
  }
}
</script>
