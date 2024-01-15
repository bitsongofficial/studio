<template>
  <v-card rounded="lg" width="230" color="black" to="/preview/ready-or-not">
    <v-img height="230" width="230" :src="img(data.image, { width: 230, height: 230, fit: 'cover' })"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)">

      <div class="d-flex justify-space-between">
        <v-chip>{{ date }}</v-chip>
        <v-chip>{{ hour }}</v-chip>
      </div>
    </v-img>
    <v-card-subtitle class="mt-2 text-caption">{{ data.subtitle }}</v-card-subtitle>
    <v-card-title class="mt-n2">{{ data.title }}</v-card-title>
    <!--<v-btn block variant="tonal" prepend-icon="mdi-bell">
      GET NOTIFIED
    </v-btn>-->
  </v-card>
</template>

<script lang="ts" setup>
const img = useImage();

const data = reactive({
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ",
  subtitle: "Adam Clay",
  title: "Ready or Not",
  startTime: 1706205600
})

const date = computed(() => {
  return new Date(data.startTime * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const hour = computed(() => {
  return new Date(data.startTime * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
})
</script>