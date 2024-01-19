<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
          Upcoming Drops
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" v-for="drop in drops" :key="drop.title">
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
}]
</script>