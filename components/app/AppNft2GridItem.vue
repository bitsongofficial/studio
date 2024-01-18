<template>
  <v-card rounded="lg" width="230" color="black">
    <NuxtLink :to="link" class="text-decoration-none text-white">
      <v-img height="230" width="230" :src="img(image, { width: 230, height: 230, fit: 'cover' })"
        gradient="to bottom, rgba(0,0,0,.10), rgba(0,0,0,.7)">

        <div class="d-flex justify-space-between">
          <v-chip>{{ date }}</v-chip>
          <v-chip>{{ hour }}</v-chip>
        </div>
      </v-img>
    </NuxtLink>
    <v-card-subtitle class="mt-2 text-caption">
      <NuxtLink :to="link" class="text-decoration-none text-white">
        {{ subtitle }}
      </NuxtLink>
    </v-card-subtitle>
    <v-card-title class="mt-n2">
      <NuxtLink :to="link" class="text-decoration-none text-white">
        {{ title }}
      </NuxtLink>
    </v-card-title>
    <ClientOnly>
      <v-card-subtitle class="mt-n1">
        Starts in
        <vue-countdown :time="remainingTime" v-slot="{ days, hours, minutes, seconds }">
          <strong>{{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s</strong>
        </vue-countdown>
      </v-card-subtitle>
    </ClientOnly>
    <AppDropNotificationBtn class="mt-3" :drop-id="dropId" :title="title" :subtitle="subtitle"
      :image="img(image, { width: 230, height: 230, fit: 'cover' })" :start-time="startTime" />
  </v-card>
</template>

<script lang="ts" setup>
import VueCountdown from '@chenfengyuan/vue-countdown';
import type AppDropNotificationBtn from './AppDropNotificationBtn.vue';

const img = useImage();

interface Props {
  image: string;
  subtitle: string;
  title: string;
  startTime: number;
  link: string;
  dropId: string;
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  subtitle: '',
  title: '',
  startTime: 0,
  link: '',
  dropId: ''
})

const remainingTime = computed(() => {
  return (props.startTime - Math.floor(Date.now() / 1000)) * 1000
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