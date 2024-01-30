<template>
  <v-container fluid v-if="activeDrops.length > 0">
    <v-row>
      <v-col>
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
          Featured Drops
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" v-for="drop in activeDrops" :key="drop.title">
        <AppNft2GridItem :drop-id="drop.id" :title="drop.title" :subtitle="drop.subtitle" :image="drop.image"
          :start-time="drop.startTime" :link="drop.link" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const drops = [{
  id: 'ready_or_not',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ",
  subtitle: "Adam Clay",
  title: "Ready or Not",
  startTime: 1706205600,
  link: "/nfts/bitsong1wl59k23zngj34l7d42y9yltask7rjlnxgccawc7ltrknp6n52fpsepyxgg"
}, {
  id: 'amnesia',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXpdm3A9YB6vgLjyiA7xKrv8UKeXhtPpTjAKEzEPKeehN",
  subtitle: "Exept",
  title: "Amnesia",
  startTime: 1706637600,
  link: "/nfts/bitsong1nwnejwsdpqktusvh8qhxe5arsznjd5asdwutmaz9n5qcpl3dcmhswz930x"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime < Math.floor(Date.now() / 1000))
})
</script>