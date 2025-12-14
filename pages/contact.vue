<!-- eslint-disable vue/html-self-closing -->
<template>
  <PageContainer>
    <div class="w-full py-10 md:py-10">
      <div class="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div class="space-y-8">
          <PageHeader
            title="CONTACT ME"
            subtitle="Have a <b>question</b> or <b>project</b> or <b>job offer</b> in mind? I'd love to hear from you. I'm passionate about my work and always open to new opportunities."
          />

          <div class="space-y-4 mt-8">
            <ContactInfoCard
              title="EMAIL"
              value="joel.stephen.work@gmail.com"
              icon="i-heroicons-envelope"
              href="mailto:joel.stephen.work@gmail.com"
            />

            <ContactInfoCard
              title="WHATSAPP"
              value="Click to message me"
              icon="i-heroicons-device-phone-mobile"
              href="https://wa.me/+971568098085"
              target="_blank"
            />

            <ContactInfoCard
              title="LOCATION"
              value="Abu Dhabi, United Arab Emirates"
              icon="i-heroicons-map-pin"
              href="https://maps.google.com/?q=Abu+Dhabi,+United+Arab+Emirates"
              target="_blank"
            />

            <ContactInfoCard
              title="RESPONSE TIME"
              value="Within 6-12 hours"
              icon="i-heroicons-clock"
            />
          </div>
        </div>

        <div
          class="bg-white dark:bg-black rounded-xl p-6 md:p-8 shadow-md border border-gray-200 dark:border-black"
        >
          <h2
            class="text-2xl font-semibold mb-6 text-red-700 dark:text-red-500"
          >
            <TypingEffect :strings="['SEND ME A MESSAGE']" :loop="false" />
          </h2>
          <UForm
            :validate="validate"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormGroup
              label="Full Name"
              name="name"
              label-class="text-gray-800 dark:text-gray-200"
            >
              <UInput
                v-model="state.name"
                placeholder="Your name / company name"
                icon="i-heroicons-user"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup
              label="Email Address"
              name="email"
              label-class="text-gray-800 dark:text-gray-200"
            >
              <UInput
                v-model="state.email"
                placeholder="your.email@example.com"
                icon="i-heroicons-envelope"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup
              label="Your Message"
              name="message"
              label-class="text-gray-800 dark:text-gray-200"
            >
              <UTextarea
                v-model="state.message"
                placeholder="What would you like to discuss? Please include any preferred contact methods."
                :rows="4"
                class="resize-none"
              />
            </UFormGroup>

            <div class="hidden" aria-hidden="true">
              <input
                v-model="honeypot"
                type="text"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <UFormGroup
              v-if="showCaptcha"
              label="Anti-Spam Verification"
              name="captcha"
              label-class="text-gray-800 dark:text-gray-200"
            >
              <div class="space-y-3">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ captchaQuestion }}
                </p>
                <UInput
                  v-model="state.captcha"
                  placeholder="Your answer"
                  size="lg"
                  aria-label="Captcha answer"
                />
              </div>
            </UFormGroup>

            <div class="pt-2">
              <UButton
                type="submit"
                block
                color="red"
                size="lg"
                :loading="isSubmitting"
                class="bg-red-700 hover:bg-red-800 text-white"
              >
                <UIcon name="i-heroicons-paper-airplane" class="mr-2" />
                Send Message
              </UButton>
            </div>
          </UForm>

          <div
            v-if="submitSuccess"
            class="mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-500 rounded-lg flex items-center gap-2"
          >
            <UIcon name="i-heroicons-check-circle" class="flex-shrink-0" />
            <p>Message sent successfully! I'll be in touch soon.</p>
          </div>

          <div
            v-if="submitError"
            class="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-500 rounded-lg flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="flex-shrink-0"
            />
            <p>{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emailjs: any;
  }
}

const EMAILJS_SERVICE_ID = "service_dnizv9b";
const EMAILJS_TEMPLATE_ID = "template_bkiydiu";
const EMAILJS_PUBLIC_KEY = "HZeS1ehR96UvqjMx_";

interface State {
  name: string | undefined;
  email: string | undefined;
  message: string | undefined;
  captcha: string | undefined;
}

const state: State = reactive({
  name: undefined,
  email: undefined,
  message: undefined,
  captcha: undefined,
});

const honeypot = ref("");

const showCaptcha = ref(true);
const captchaQuestions = [
  { question: "What is 2 + 3?", answer: "5" },
  { question: "What is 4 + 5?", answer: "9" },
  { question: "What is 7 - 2?", answer: "5" },
  { question: "What is 10 - 5?", answer: "5" },
  { question: "What is 3 × 3?", answer: "9" },
  { question: "What is 2 × 4?", answer: "8" },
];

const captchaIndex = ref(Math.floor(Math.random() * captchaQuestions.length));
const captchaQuestion = computed(
  () => captchaQuestions[captchaIndex.value].question,
);
const captchaAnswer = computed(
  () => captchaQuestions[captchaIndex.value].answer,
);

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);
const errorMessage = ref("");

const submissionAttempts = ref(0);
const lastSubmissionTime = ref(0);

onMounted(() => {
  if (!document.getElementById("emailjs-script")) {
    const script = document.createElement("script");
    script.id = "emailjs-script";
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    };
  }

  const botDetectionDelay = 100;
  setTimeout(() => {
    if (state.name || state.email || state.message || honeypot.value) {
      console.warn("Potential automated form fill detected");
    }
  }, botDetectionDelay);
});

const validate = (state: State): FormError[] => {
  const errors: FormError[] = [];

  if (!state.name?.trim()) {
    errors.push({
      path: "name",
      message: "Please enter your name",
    });
  } else if (state.name.trim().length < 2) {
    errors.push({
      path: "name",
      message: "Name must be at least 2 characters",
    });
  }

  if (!state.email?.trim()) {
    errors.push({
      path: "email",
      message: "Please enter your email address",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({
      path: "email",
      message: "Please enter a valid email address",
    });
  }

  if (!state.message?.trim()) {
    errors.push({
      path: "message",
      message: "Please enter your message",
    });
  } else if (state.message.trim().length < 10) {
    errors.push({
      path: "message",
      message: "Message must be at least 10 characters",
    });
  }

  if (
    showCaptcha.value &&
    (!state.captcha ||
      state.captcha.trim().toLowerCase() !== captchaAnswer.value.toLowerCase())
  ) {
    errors.push({
      path: "captcha",
      message: "Please answer the verification question correctly",
    });
  }

  return errors;
};

async function onSubmit(event: FormSubmitEvent<State>) {
  if (event) {
    const now = Date.now();

    if (honeypot.value !== "") {
      console.warn("Honeypot triggered, likely bot submission");
      submitError.value = true;
      errorMessage.value = "Form submission failed. Please try again later.";
      return;
    }

    if (now - lastSubmissionTime.value < 2000) {
      submitError.value = true;
      errorMessage.value = "Please wait before submitting again.";
      return;
    }

    submissionAttempts.value++;
    lastSubmissionTime.value = now;

    if (submissionAttempts.value > 5) {
      submitError.value = true;
      errorMessage.value =
        "Too many submission attempts. Please try again later.";
      return;
    }

    isSubmitting.value = true;
    submitSuccess.value = false;
    submitError.value = false;

    try {
      if (!window.emailjs) {
        throw new Error("Email service is not loaded. Please try again later.");
      }

      if (
        showCaptcha.value &&
        state.captcha?.trim().toLowerCase() !==
          captchaAnswer.value.toLowerCase()
      ) {
        throw new Error("Incorrect verification answer");
      }

      const templateParams = {
        to_email: "joel.stephen.work@gmail.com",
        from_name: state.name,
        from_email: state.email,
        message: state.message,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
      );

      submitSuccess.value = true;

      captchaIndex.value = Math.floor(Math.random() * captchaQuestions.length);
      state.captcha = undefined;
      state.name = undefined;
      state.email = undefined;
      state.message = undefined;
      submissionAttempts.value = 0;
    } catch (error) {
      submitError.value = true;
      errorMessage.value =
        error instanceof Error
          ? error.message
          : "There was an error sending your message. Please email me directly at joel.stephen.work@gmail.com.";

      captchaIndex.value = Math.floor(Math.random() * captchaQuestions.length);
      state.captcha = undefined;
    } finally {
      isSubmitting.value = false;
    }
  }
}

function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id);
  if (element) {
    setTimeout(() => {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }
}
</script>
