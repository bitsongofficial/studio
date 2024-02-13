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
}, {
  id: 'stimulation-growth',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmYLRV4zMcFoREqaxNucwMBxWuNsZ1vKiNWmqYYP65ku8C",
  subtitle: "Goose Pärk",
  title: "Stimulation Growth",
  startTime: 1706810400,
  link: "/nfts/bitsong18a0pvw326fydfdat5tzyf4t8lhz0v6fyfaujpeg07fwqkygcxejsv0vqlr"
}, {
  id: 'orderly',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmTiA71AFHvN68KQncdwEnvYVoS9s4djrCCiwri7jsXjmU",
  subtitle: "Alan Scarlato",
  title: "Orderly",
  startTime: 1706882400,
  link: "/nfts/bitsong12njsx22ne73swjqxxn5e7xtc2n95y2aw8r73cqdth0g86way24cq6f5az9"
}, {
  id: 'toxic',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmeWR7bdNDpZZSCKdY3fPgNPB2nkBJ1PS7fJaDFmp56MKW",
  subtitle: "Rawanne",
  title: "Toxic",
  startTime: 1706896800,
  link: "/nfts/bitsong16p5fm4qrpjpxd8f5wpt48fgyyd5c79q4n35fgvq7x2yks2lu8llq3kre6f"
}, {
  id: 'cubana',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQZEdsvxqkoUTA9YLzgiHfPJtyh2fTToqhJ1zyzdTc4PT",
  subtitle: "BlackJack Records",
  title: "Cubana",
  startTime: 1706968800,
  link: "/nfts/bitsong19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseueststug5"
}, {
  id: 'next-level',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWh6qGWacSv3VAVWyAKVirJqMXD7X8pUVPXTTjM9Fh1kA",
  subtitle: "Florin Dumbraveanu",
  title: "Next Level",
  startTime: 1707242400,
  link: "/nfts/bitsong1ypk8p7c82whs9xdja6ku7q6slzj8kvfwkgxnyeuevhtf03fteylqg2wymp"
}, {
  id: 'sing-for-me',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmZXSzWNcx6WFB4FSsHURzrPge1pyiJEstcH2haFgsgJyX",
  subtitle: "Anirbas",
  title: "Sing For Me",
  startTime: 1707328800,
  link: "/nfts/bitsong1hz3svgdhmv67lsqlduu0tcnd3f75c0xr0mu48l6ywuwlz43zssjqsm3f2z"
}, {
  id: 'i-will-never-see-you-again',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmY1FVpeTN4BcZuR8wR5jSN1XN3gQZNLWWg6Qo6ACLqxHx",
  subtitle: "A.way",
  title: "I Will Never See You Again",
  startTime: 1707501600,
  link: "/nfts/bitsong1lj48z799hq4hgzg6ppdzsq55h6cezfe0cmrnnv7cclkpw9qrvf9sj4u92l"
}, {
  id: 'perrea',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbfyAeFNxMFBtBP6UrxRTEe8oKjJeNSiEsJ7RZ1otgcjA",
  subtitle: "Joe Bertè",
  title: "Perrea",
  startTime: 1707760800,
  link: "/nfts/bitsong1cvt7dz7fhhuhh8qrzjnq6uel4wnpswt5uq7d97kg4sh99dlrehds54w5t8"
}, {
  id: '14',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQ7rFzs8wbuvJxMb6AYDUHT6mVFtz6cMweo9pE5Hg3MZw",
  subtitle: "Puro Lobo",
  title: "14",
  startTime: 1707847200,
  link: "/nfts/bitsong1r57m20afwdhkwy67520p8vzdchzecesmlmc8k8w2z7t3h9aevjvseq4k7r"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime < Math.floor(Date.now() / 1000))
})
</script>