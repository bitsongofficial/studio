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
  id: 'anything-i-do',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmcwP241RSACz8LcZy8ms49TSpgGheq8ejRHPsXRaJZDwP",
  subtitle: "BlackJack, Hamster NFT",
  title: "Anything I Do",
  startTime: 1710352800,
  link: "/preview/anything-i-do"
}, {
  id: 'feeling-good',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/Qmf1KLZF1TWums7VYMzg8Ark8cU2XhX91yNzoj5kGFXMX2",
  subtitle: "Torrex, J Press & Deviless",
  title: "Feeling Good",
  startTime: 1710957600,
  link: "/preview/feeling-good"
}, {
  id: 'spicy',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQpN2HN6HECMEo7WrWcrR2dtyMZwCGfRqn2hFveo5tRMc",
  subtitle: "J Press",
  title: "Spicy",
  startTime: 1711044000,
  link: "/preview/spicy"
}, {
  id: 'i-want-to',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPs61TrrSyjvTZeuPsHKUY8MNiAXkTH196CQprdumhp92",
  subtitle: "Alpaca, Dario Denso",
  title: "I Want To",
  startTime: 1711130400,
  link: "/preview/i-want-to"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
    .sort((a, b) => a.startTime - b.startTime)
})
</script>