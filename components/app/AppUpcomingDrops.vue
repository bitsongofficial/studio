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
  id: 'next-level',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWh6qGWacSv3VAVWyAKVirJqMXD7X8pUVPXTTjM9Fh1kA",
  subtitle: "Florin Dumbraveanu",
  title: "Next Level",
  startTime: 1707242400,
  link: "/preview/next-level"
}, {
  id: 'sing-for-me',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmZXSzWNcx6WFB4FSsHURzrPge1pyiJEstcH2haFgsgJyX",
  subtitle: "Anirbas",
  title: "Sing For Me",
  startTime: 1707328800,
  link: "/preview/sing-for-me"
}, {
  id: 'i-will-never-see-you-again',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmY1FVpeTN4BcZuR8wR5jSN1XN3gQZNLWWg6Qo6ACLqxHx",
  subtitle: "A.way",
  title: "I Will Never See You Again",
  startTime: 1707501600,
  link: "/preview/i-will-never-see-you-again"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
})
</script>