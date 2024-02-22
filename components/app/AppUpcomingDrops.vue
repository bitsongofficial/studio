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
}, {
  id: '14',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQ7rFzs8wbuvJxMb6AYDUHT6mVFtz6cMweo9pE5Hg3MZw",
  subtitle: "Puro Lobo",
  title: "14",
  startTime: 1707847200,
  link: "/preview/14"
}, {
  id: 'on-the-fly',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmY9Qe1VUTjnvrXNAqeH3YV564STJ3HogWM1EQfe5G1Bn8",
  subtitle: "Joe Mangione",
  title: "On The Fly",
  startTime: 1707933600,
  link: "/preview/on-the-fly"
}, {
  id: 'need-backup',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmeZqmGpw2BD6mtVAPFmjSZ2ypas4iB3rqHLZnPqWWfaRR",
  subtitle: "Florin Dumbraveanu",
  title: "Need Backup",
  startTime: 1708020000,
  link: "/preview/need-backup"
}, {
  id: 'under-pressure',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/Qmb74GezcrGpucDDank3WE8HEQVLDFfTAyea2jmbJz2Lct",
  subtitle: "H.O.D.E.",
  title: "Under Pressure",
  startTime: 1708192800,
  link: "/preview/under-pressure"
}, {
  id: 'out-of-web',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmYmGZ4zr8mbopBp4Hm2EDPtbMjQR75H8mk1iG97EjeNbA",
  subtitle: "The Genesis Projection",
  title: "Out of Web (3.0)",
  startTime: 1708491600,
  link: "/preview/out-of-web"
}, {
  id: 'glory',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRpEuACERGTLctqQaAjiPfQnj8XrzUkF8o6rmLLhCvSzg",
  subtitle: "Triplo Max",
  title: "GLORY",
  startTime: 1709229600,
  link: "/preview/glory"
}, {
  id: 'ethernal-darkness',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmUNf866qqVnoxA5bQXXzsFkGs9KM79UHL3w2GiDUtZX6o",
  subtitle: "House of Disaster",
  title: "Ethernal Darkness",
  startTime: 1708596000,
  link: "/preview/ethernal-darkness"
}, {
  id: 'pure-madness',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmNiDzBVHQKaFn3MiyN4QdeMpsNzUd2G1oLodD5S3Njkp6",
  subtitle: "H.O.D.E.",
  title: "Pure Madness",
  startTime: 1708621200,
  link: "/preview/pure-madness"
}, {
  id: 'supreme-forces',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbaW1vD8cYCtGLWxfyS4cbCCnj5fHewXnMA46mC8JC9UY",
  subtitle: "House Of Disaster",
  title: "Supreme Forces",
  startTime: 1708682400,
  link: "/preview/supreme-forces"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
    .sort((a, b) => a.startTime - b.startTime)
})
</script>