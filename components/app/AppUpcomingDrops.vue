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
  id: 'glory',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRpEuACERGTLctqQaAjiPfQnj8XrzUkF8o6rmLLhCvSzg",
  subtitle: "Triplo Max",
  title: "GLORY",
  startTime: 1709229600,
  link: "/preview/glory"
}, {
  id: 'uno-dos-tres',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXVXMo3TESkYnXbR8zb1kBeRRtRhYkTDK9T9uFjoTBdjo",
  subtitle: "Torrex",
  title: "Uno Dos Tres",
  startTime: 1709056800,
  link: "/preview/uno-dos-tres"
}, {
  id: 'destructure',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPSq8vYWJ1ALdjBAyju2Gb2yyUoXHwpLwxVoyFrUjVa52",
  subtitle: "Luca Testa",
  title: "Destructure (Feat Gab3z)",
  startTime: 1709143200,
  link: "/preview/destructure"
}, {
  id: 'feel-the-vibe',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRWZFsYP9m1eQeSooSSk72hBwECLy11U7RvR6mZGuUEKS",
  subtitle: "Dino Brown, Adam Clay",
  title: "Feel The Vibe",
  startTime: 1709316000,
  link: "/preview/feel-the-vibe"
}, {
  id: 'wind-still-blows',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPCoexML73gyABtNfJthK2qMwpLqF5Q5F2scS9jr6qVtS",
  subtitle: "Kiras",
  title: "The Wind Still Blows",
  startTime: 1709661600,
  link: "/preview/wind-still-blows"
}, {
  id: 'all-i-want',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmdKJA6PG55qc3Hbe9Qp8njFjtc8MxMkkU8buvhZUr3shj",
  subtitle: "J Press",
  title: "All I Want",
  startTime: 1709575200,
  link: "/preview/all-i-want"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
    .sort((a, b) => a.startTime - b.startTime)
})
</script>