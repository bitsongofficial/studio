<template>
  <img :src="image ? image : ogImage" :style="{ objectFit: 'cover', objectPosition: 'cener' }" class="h-full w-full" />

  <div
    class="flex flex-col justify-end h-full w-full bg-slate-900/85 text-white p-20 text-2xl font-bold absolute inset-0">

    <img :src="image" class="w-40 h-40 rounded-xl border-4 border-white" />

    <h1 class="pb-0 mb-0 font-bold">{{ title }}</h1>
    <div class="text-gray-400 mb-8 font-bold text-3xl">{{ subtitle }}</div>

    <div class="flex flex-row">
      <div>
        <div class="text-4xl font-bold m-0">{{ editions }}</div>
        <div class="text-3xl text-gray-400 m-0">editions</div>
      </div>

      <div class="ml-20">
        <div class="text-4xl font-bold m-0">{{ owners }}</div>
        <div class="text-3xl text-gray-400 m-0">owners</div>
      </div>

      <div class="ml-20">
        <div class="text-4xl font-bold m-0">{{ priceFormatted }} BTSG</div>
        <div class="text-3xl text-gray-400 m-0">price</div>
      </div>

      <div class="ml-20">
        <div class="text-4xl font-bold m-0">{{ volumeFormatted }} BTSG</div>
        <div class="text-3xl text-gray-400 m-0">volume</div>
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
  editions?: string | number
  owners?: string | number
  price?: string | number
  volume?: string | number
}>(), {
  title: '',
  subtitle: '',
  image: '',
  editions: 0,
  owners: 0,
  price: 0,
  volume: 0,
})

const priceFormatted = computed(() => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(props.price || 0) / 1000000)
})

const volumeFormatted = computed(() => {
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(Number(props.volume || 0) / 1000000)
})
</script>