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
  id: 'ready_or_not',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ",
  subtitle: "Adam Clay",
  title: "Ready or Not",
  startTime: 1706205600,
  link: "/preview/ready-or-not"
}, {
  id: 'amnesia',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXpdm3A9YB6vgLjyiA7xKrv8UKeXhtPpTjAKEzEPKeehN",
  subtitle: "Exept",
  title: "Amnesia",
  startTime: 1706637600,
  link: "/preview/amnesia"
}, {
  id: 'stimulation-growth',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXecjfvfZB1qs24EU1ra1i7hWUMNd9YDMriKHSAmFD3sg",
  subtitle: "Goose Pärk",
  title: "Stimulation Growth",
  startTime: 1706810400,
  link: "/preview/stimulation-growth"
}, {
  id: 'orderly',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmTiA71AFHvN68KQncdwEnvYVoS9s4djrCCiwri7jsXjmU",
  subtitle: "Alan Scarlato",
  title: "Orderly",
  startTime: 1706882400,
  link: "/preview/orderly"
}, {
  id: 'toxic',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmeWR7bdNDpZZSCKdY3fPgNPB2nkBJ1PS7fJaDFmp56MKW",
  subtitle: "Rawanne",
  title: "Toxic",
  startTime: 1706896800,
  link: "/preview/toxic"
}, {
  id: 'cubana',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQZEdsvxqkoUTA9YLzgiHfPJtyh2fTToqhJ1zyzdTc4PT",
  subtitle: "BlackJack Records",
  title: "Cubana",
  startTime: 1706968800,
  link: "/preview/cubana"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
})
</script>