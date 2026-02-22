// plugins/vercel-analytics.client.js

import { inject } from "@vercel/analytics";

export default defineNuxtPlugin(() => {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => inject(), { timeout: 3000 });
  } else {
    setTimeout(() => inject(), 2000);
  }
});
