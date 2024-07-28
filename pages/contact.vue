<template>
    <UContainer>
      <div class="w-full pt-12 md:pt-24 lg:pt-32 pb-10">
        <h1 class="text-4xl font-bold mb-4">Contact Me</h1>
        <p class="mb-8">
          Feel free to reach out with any questions or inquiries. I'll get back to you as soon as possible.
        </p>
        <div class="grid gap-4 md:grid-cols-2 md:gap-16">
            <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
                <UFormGroup label="Name" name="name">
                    <UInput v-model="state.name" type="text" />
                </UFormGroup>
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>
                <UFormGroup label="Message" name="message">
                    <UInput v-model="state.message" type="text" />
                </UFormGroup>

                <UButton type="submit">
                Submit
                </UButton>
            </UForm>
  
          <div>
            <!-- Maybe something can go here -->
          </div>
        </div>
      </div>
    </UContainer>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'

const state = reactive({
    name: undefined,
    email: undefined,
    message: undefined,
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name || state.name.length < 3) errors.push({ path: 'name', message: 'Name must be at least 3 characters' })
  if (!state.email || !/\S+@\S+\.\S+/.test(state.email)) errors.push({ path: 'email', message: 'Invalid email' })
  if (!state.message || state.message.length < 15) errors.push({ path: 'message', message: 'Message must be at least 15 characters' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<any>) {
  const name = encodeURIComponent(state.name)
  const email = encodeURIComponent(state.email)
  const message = encodeURIComponent(state.message)
  const mailtoLink = `mailto:joel.stephen.work@gmail.com?subject=Contact%20Form%20Submission&body=Name:%20${name}%0AEmail:%20${email}%0AMessage:%20${message}`
  window.location.href = mailtoLink
}

async function onError (event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id)
  element?.focus()
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>
