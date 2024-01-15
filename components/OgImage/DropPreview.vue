<template>
  <img :src="image ? image : ogImage" :style="{ objectFit: 'cover', objectPosition: 'cener' }" class="h-full w-full" />

  <div
    class="flex flex-col justify-end h-full w-full bg-slate-900/85 text-white p-20 text-2xl font-bold absolute inset-0">

    <img :src="image" class="w-40 h-40 rounded-xl border-4 border-white" />

    <h1 class="pb-0 mb-0 font-bold">{{ title }}</h1>
    <div class="text-gray-400 mb-8 font-bold text-3xl">{{ subtitle }}</div>

    <div class="flex flex-row">
      <div>
        <div class="text-4xl font-bold m-0">{{ date }} {{ hour }}</div>
        <div class="text-3xl text-gray-400 m-0">Start Time</div>
      </div>

    </div>

  </div>

  <img src="/images/logo-circle.svg" alt="logo" class="absolute bottom-20 right-20 w-24 h-24" />
</template>

<script lang="ts" setup>
import ogImage from '~/assets/images/og-default-1200.png'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  image?: string
  startTime?: number
}>(), {
  title: '',
  subtitle: '',
  image: '',
  startTime: 0,
})

const date = computed(() => {
  return new Date(props.startTime * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const hour = computed(() => {
  return new Date(props.startTime * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
})
</script>