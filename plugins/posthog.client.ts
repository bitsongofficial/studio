import { defineNuxtPlugin } from '#app'
import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: '/ingest',
    ui_host: `https://eu.posthog.com`,
    capture_pageview: false, // we add manual pageview capturing below
    capture_pageleave: true,
    autocapture: false,
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') {
        // posthog.debug()
        posthog.opt_out_capturing();
        posthog.set_config({ disable_session_recording: true });
      }
    }
  })

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', {
        current_url: to.fullPath
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient
    }
  }
})