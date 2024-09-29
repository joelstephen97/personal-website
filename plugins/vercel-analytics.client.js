// plugins/vercel-analytics.client.js

import { inject } from '@vercel/analytics';

export default defineNuxtPlugin(() => {
  inject();
});