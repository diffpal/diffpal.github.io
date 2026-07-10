<script setup lang="ts">
import { onMounted, ref } from 'vue'

const storageKey = 'diffpal-analytics-consent'
const analyticsID = 'G-B8G6D7K9SQ'
const showChoices = ref(false)
const hasChoice = ref(false)

function loadAnalytics() {
  if (document.querySelector(`script[data-diffpal-analytics="${analyticsID}"]`)) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', analyticsID, { anonymize_ip: true })

  const script = document.createElement('script')
  script.async = true
  script.dataset.diffpalAnalytics = analyticsID
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsID}`
  document.head.appendChild(script)
}

function choose(value: 'accepted' | 'declined') {
  localStorage.setItem(storageKey, value)
  hasChoice.value = true
  showChoices.value = false
  if (value === 'accepted') loadAnalytics()
}

onMounted(() => {
  const choice = localStorage.getItem(storageKey)
  hasChoice.value = choice === 'accepted' || choice === 'declined'
  showChoices.value = !hasChoice.value
  if (choice === 'accepted') loadAnalytics()
})
</script>

<template>
  <button v-if="hasChoice && !showChoices" class="privacy-choice-button" type="button" @click="showChoices = true">
    Privacy choices
  </button>
  <aside v-if="showChoices" class="privacy-consent" aria-label="Analytics privacy choices">
    <p>
      DiffPal uses optional Google Analytics to understand documentation usage.
      Nothing is loaded unless you accept. <a href="/privacy">Privacy details</a>
    </p>
    <div>
      <button type="button" class="decline" @click="choose('declined')">Decline</button>
      <button type="button" class="accept" @click="choose('accepted')">Accept analytics</button>
    </div>
  </aside>
</template>

<script lang="ts">
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}
</script>
