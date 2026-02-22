<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <header class="text-center mb-8" aria-labelledby="contact-heading">
      <p class="text-xs font-medium text-accent tracking-wide uppercase mb-2">
        Get in touch
      </p>
      <h1
        id="contact-heading"
        class="text-h2 font-bold text-foreground mb-1"
      >
        Contact
      </h1>
      <p class="text-sm text-muted max-w-md mx-auto">
        Let's talk.
      </p>
    </header>

    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
      <!-- Left: Contact info -->
      <section
        class="glass-solid rounded-2xl p-5 flex flex-col"
        aria-label="Contact details"
      >
        <h2 class="flex items-center gap-2 text-lg font-semibold text-accent mb-3">
          <Icon name="Mail" :size="18" />
          Reach out
        </h2>
        <div class="space-y-2 flex-1">
          <component
            v-for="info in contactInfo"
            :key="info.label"
            :is="info.href ? 'a' : 'div'"
            :href="info.href || undefined"
            :target="info.external ? '_blank' : undefined"
            class="flex items-center gap-3 p-3 rounded-lg glass-solid hover:border-accent/30 transition-all group"
          >
            <div
              class="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"
            >
              <Icon :name="info.icon" :size="18" class="text-accent" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-xs font-medium text-foreground group-hover:text-accent transition-colors truncate"
                :title="info.label"
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
          </component>
        </div>
      </section>

      <!-- Right: Message form -->
      <section class="glass-solid rounded-2xl p-5" aria-labelledby="form-heading">
        <h2 id="form-heading" class="flex items-center gap-2 text-lg font-semibold text-accent mb-3">
          <Icon name="Send" :size="18" />
          Message
        </h2>

        <form class="space-y-2" @submit.prevent="submit">
          <div>
            <label
              class="block text-xs font-medium text-foreground mb-0.5"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium text-foreground mb-0.5"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium text-foreground mb-0.5"
              >Message</label
            >
            <textarea
              v-model="form.message"
              rows="2"
              placeholder="Your message..."
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none"
            />
          </div>
          <div>
            <label
              class="block text-xs font-medium text-foreground mb-0.5"
              >{{ captcha.q }}</label
            >
            <input
              v-model="form.captcha"
              type="text"
              placeholder="Answer"
              class="w-full px-3 py-1.5 text-sm rounded-lg bg-[rgb(var(--glass))] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
            />
          </div>
          <button
            type="submit"
            :disabled="sending || !emailjsReady"
            class="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2 py-2 text-sm"
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
            class="mt-2 p-2 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2 text-success text-xs"
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
            class="mt-2 p-2 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2 text-error text-xs"
          >
            <Icon name="CircleAlert" :size="18" />
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
        </Transition>

        <div class="mt-3 pt-3 border-t border-border">
          <p class="text-xs text-muted-foreground mb-2">Demo: WebAuthn</p>
          <button
            v-if="webauthnSupported"
            type="button"
            class="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            :disabled="webauthnLoading"
            @click="tryWebAuthn"
          >
            <Icon name="Fingerprint" :size="16" />
            {{ webauthnLoading ? "Checking..." : webauthnSuccess ? "Authenticated" : "Try biometric login" }}
          </button>
          <p v-else class="text-xs text-muted">
            WebAuthn not supported in this browser.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Contact | Joel Stephen - Software Engineer",
  description:
    "Get in touch with Joel Stephen. Email, LinkedIn, WhatsApp, Calendly. Based in Abu Dhabi, UAE. Open to work globally.",
});

import { reactive, ref, onMounted } from "vue";
import Icon from "~/components/ui/Icon.vue";
import emailjs from "@emailjs/browser";

const contactInfo = [
  {
    label: "Email",
    value: "joel.stephen.work@gmail.com",
    icon: "Mail",
    href: "mailto:joel.stephen.work@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "Connect",
    icon: "Linkedin",
    href: "https://linkedin.com/in/joelthomasstephen",
    external: true,
  },
  {
    label: "WhatsApp",
    value: "Message me",
    icon: "MessageCircle",
    href: "https://wa.me/+971568098085",
    external: true,
  },
  {
    label: "Calendly",
    value: "Book a call",
    icon: "Calendar",
    href: "https://calendly.com/joel-stephen-work/30min",
    external: true,
  },
  {
    label: "Location",
    value: "Abu Dhabi, UAE · GST (UTC+4)",
    icon: "MapPin",
    href: "https://maps.google.com/?q=Abu+Dhabi",
    external: true,
  },
  {
    label: "Response time",
    value: "Usually within 24 hours",
    icon: "Timer",
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
  emailjs.init({ publicKey: "HZeS1ehR96UvqjMx_" });
  emailjsReady.value = true;
});

async function submit() {
  if (form.captcha !== captcha.a) return;
  if (!emailjsReady.value) return;
  sending.value = true;
  error.value = null;
  try {
    await emailjs.send("service_psja64o", "template_bkiydiu", {
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

const webauthnSupported =
  typeof window !== "undefined" &&
  window.PublicKeyCredential !== undefined;
const webauthnLoading = ref(false);
const webauthnSuccess = ref(false);

async function tryWebAuthn() {
  if (!webauthnSupported) return;
  webauthnLoading.value = true;
  webauthnSuccess.value = false;
  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rpId: window.location.hostname || "localhost",
        userVerification: "preferred",
        timeout: 60000,
      },
    });
    webauthnSuccess.value = !!credential;
  } catch {
    webauthnSuccess.value = false;
  } finally {
    webauthnLoading.value = false;
  }
}
</script>
