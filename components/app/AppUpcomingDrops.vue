<template>
  <v-container fluid v-if="activeDrops.length > 0">
    <v-row>
      <v-col>
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
          Upcoming Drops
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="drop in activeDrops" cols="auto" :key="drop.title">
        <AppNft2GridItem :drop-id="drop.id" :title="drop.title" :subtitle="drop.subtitle" :image="drop.image"
          :start-time="drop.startTime" :link="drop.link" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const drops = [{
  id: 'perrea',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbfyAeFNxMFBtBP6UrxRTEe8oKjJeNSiEsJ7RZ1otgcjA",
  subtitle: "Joe Bertè",
  title: "Perrea",
  startTime: 1707760800,
  link: "/preview/perrea"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
})
</script>