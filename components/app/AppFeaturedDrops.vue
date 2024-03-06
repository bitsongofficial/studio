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
}, {
  id: 'on-the-fly',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmY9Qe1VUTjnvrXNAqeH3YV564STJ3HogWM1EQfe5G1Bn8",
  subtitle: "Joe Mangione",
  title: "On The Fly",
  startTime: 1707933600,
  link: "/nfts/bitsong10t2y7f9m0twpsrz3kvfp55nlgzc86kace2se3uarkv380h3pk6qqtkt9p7"
}, {
  id: 'need-backup',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmeZqmGpw2BD6mtVAPFmjSZ2ypas4iB3rqHLZnPqWWfaRR",
  subtitle: "Florin Dumbraveanu",
  title: "Need Backup",
  startTime: 1708020000,
  link: "/nfts/bitsong14tccd5wwd6ygwtx67xdfpzz8xn8ysd3rkmkd3pj326l2v7asjr6qxgf7gr"
}, {
  id: 'under-pressure',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/Qmb74GezcrGpucDDank3WE8HEQVLDFfTAyea2jmbJz2Lct",
  subtitle: "H.O.D.E.",
  title: "Under Pressure",
  startTime: 1708192800,
  link: "/nfts/bitsong1pcmlq5cwmy9lxfhynnuhd0r2djm2xn3ff2xc6njncs8sxzlgle3s06wsc8"
}, {
  id: 'out-of-web',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmYmGZ4zr8mbopBp4Hm2EDPtbMjQR75H8mk1iG97EjeNbA",
  subtitle: "The Genesis Projection",
  title: "Out of Web (3.0)",
  startTime: 1708491600,
  link: "/nfts/bitsong1xq7yffwchsu2ldw3lukgzcncryva7wt35gv9cr59wt6ts2ktknwqt6atp0"
}, {
  id: 'glory',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRpEuACERGTLctqQaAjiPfQnj8XrzUkF8o6rmLLhCvSzg",
  subtitle: "Triplo Max",
  title: "GLORY",
  startTime: 1709229600,
  link: "/nfts/bitsong1kjmzvl2us872qverxre5shu747zsx4rh0xp58l4hx838ck7zcp0qzww59y"
}, {
  id: 'ethernal-darkness',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmUNf866qqVnoxA5bQXXzsFkGs9KM79UHL3w2GiDUtZX6o",
  subtitle: "House of Disaster",
  title: "Ethernal Darkness",
  startTime: 1708596000,
  link: "/nfts/bitsong1w9udhqtvuefwfmx7af9qe5jjhmrjk4p7ezxm6py08puykgen6uhqk8nxyh"
}, {
  id: 'pure-madness',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmNiDzBVHQKaFn3MiyN4QdeMpsNzUd2G1oLodD5S3Njkp6",
  subtitle: "H.O.D.E.",
  title: "Pure Madness",
  startTime: 1708621200,
  link: "/nfts/bitsong1cv5er0wsla3u33w6rkn7ckxpn88huqh9aw0xpu0pagksege7v7nssqvs3x"
}, {
  id: 'supreme-forces',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbaW1vD8cYCtGLWxfyS4cbCCnj5fHewXnMA46mC8JC9UY",
  subtitle: "House Of Disaster",
  title: "Supreme Forces",
  startTime: 1708682400,
  link: "/nfts/bitsong1hdnu502uecmddk9w48kxvekgp43mjdpr3mza9kj2tfvjpgef5grs2t5qp5"
}, {
  id: 'uno-dos-tres',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXVXMo3TESkYnXbR8zb1kBeRRtRhYkTDK9T9uFjoTBdjo",
  subtitle: "Torrex",
  title: "Uno Dos Tres",
  startTime: 1709056800,
  link: "/nfts/bitsong1r8td9cjggx9f5ek2gzfh34kguxuz5j9rfjemamvjw2he2y84t3xqp9vgyz"
}, {
  id: 'destructure',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPSq8vYWJ1ALdjBAyju2Gb2yyUoXHwpLwxVoyFrUjVa52",
  subtitle: "Luca Testa",
  title: "Destructure (Feat Gab3z)",
  startTime: 1709143200,
  link: "/nfts/bitsong1l0z6d7wlwpwequtenwt8pd44685jyhqys6jdnp8xa8ektn0un4zshplnar"
}, {
  id: 'feel-the-vibe',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRWZFsYP9m1eQeSooSSk72hBwECLy11U7RvR6mZGuUEKS",
  subtitle: "Dino Brown, Adam Clay",
  title: "Feel The Vibe",
  startTime: 1709316000,
  link: "/nfts/bitsong156x86uprzaj04v7qwnpl8djj5jws3gn73jz08qkydmkd0c0lp6gqn6xarq"
}, {
  id: 'wind-still-blows',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPCoexML73gyABtNfJthK2qMwpLqF5Q5F2scS9jr6qVtS",
  subtitle: "Kiras",
  title: "The Wind Still Blows",
  startTime: 1709661600,
  link: "/nfts/bitsong18dhyf7sdkjpmgu4jg6fmf4d6cyj9lez6c2cs5lvprkmyctfrtnzq94q0l6"
}, {
  id: 'all-i-want',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmdKJA6PG55qc3Hbe9Qp8njFjtc8MxMkkU8buvhZUr3shj",
  subtitle: "J Press",
  title: "All I Want",
  startTime: 1709575200,
  link: "/nfts/bitsong1dhmd8lredr9psu4afk8j3lstdg896pme49mje6maxucuuugmmptspwx04e"
}, {
  id: 'closer',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmdbSuJW3a1xWoLgPosaKkKW3ihSGKDWuXVMNQNsyUXr4W",
  subtitle: "Florin Dumbraveanu",
  title: "Closer",
  startTime: 1710525600,
  link: "/nfts/bitsong1lgprt38gkp4nvggjl0dm0e7k5lgd80e525f8rjg60tc6fk2xexcqad682u"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime < Math.floor(Date.now() / 1000))
    .sort((a, b) => b.startTime - a.startTime)
})
</script>