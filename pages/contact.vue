<!-- eslint-disable vue/html-self-closing -->
<template>
  <UContainer>
    <div class="w-full pt-12 md:pt-24 lg:pt-32 pb-10">
      <h1 class="text-4xl font-bold mb-4">Contact Me</h1>
      <p class="mb-8">
        Feel free to reach out with any questions or inquiries. I'll get back to
        you as soon as possible.
      </p>
      <div class="grid gap-2 md:grid-cols-2 md:gap-2">
        <div
          v-if="colorMode.value === 'dark'"
          class="flex items-center justify-center w-[300px] h-[300px]"
        >
          <img
            src="@/assets/phone-white.svg"
            alt="Phone icon"
            class="w-92 h-92"
          />
        </div>
        <div
          v-else
          class="flex items-center justify-center w-[300px] h-[300px]"
        >
          <img
            src="@/assets/phone-black.svg"
            alt="Phone icon"
            class="w-92 h-92"
          />
        </div>
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          @error="onError"
        >
          <UFormGroup label="Name" name="name">
            <UInput v-model="state.name" type="text" />
          </UFormGroup>
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>
          <UFormGroup label="Message" name="message">
            <UInput v-model="state.message" type="text" />
          </UFormGroup>

          <UButton type="submit" color="black"> Submit </UButton>
        </UForm>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";

interface State {
  name: string | undefined;
  email: string | undefined;
  message: string | undefined;
}

const state: State = reactive({
  name: undefined,
  email: undefined,
  message: undefined,
});

const colorMode = useColorMode();

const validate = (state: State): FormError[] => {
  const errors: FormError[] = [];
  if (!state.name || state.name.length < 3)
    errors.push({
      path: "name",
      message: "Name must be at least 3 characters",
    });
  if (!state.email || !/\S+@\S+\.\S+/.test(state.email))
    errors.push({ path: "email", message: "Invalid email" });
  if (!state.message || state.message.length < 15)
    errors.push({
      path: "message",
      message: "Message must be at least 15 characters",
    });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<State>) {
  if (event) {
    const name = encodeURIComponent(state.name || "");
    const email = encodeURIComponent(state.email || "");
    const message = encodeURIComponent(state.message || "");
    const mailtoLink = `mailto:joel.stephen.work@gmail.com?subject=Contact%20Form%20Submission&body=Name:%20${name}%0AEmail:%20${email}%0AMessage:%20${message}`;
    window.location.href = mailtoLink;
  }
}

async function onError(_event: FormErrorEvent) {
  const element = document.getElementById(_event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>
