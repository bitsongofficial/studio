<template>
  <app-page>
    <template #body>
      <v-alert class="my-2">This page is under construction, come back soon!</v-alert>
      <v-container fluid>
        <v-row>
          <v-col>
            <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
              Italia
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="cursor: pointer;" v-for="radio in radios" :key="radio.id" cols="auto" @click="play(radio.id)">
            <v-card rounded="lg" width="230" color="black">
              <v-img :transition="false" height="230" width="230"
                :src="img(radio.cover, { width: 230, height: 230, fit: 'cover', format: 'webp' })"
                gradient="to bottom, rgba(0,0,0,.07), rgba(0,0,0,.2)" />
              <v-card-subtitle class="mt-2 text-caption text-white">
                {{ radio.artist }}
              </v-card-subtitle>
              <v-card-title class="mt-n2">
                {{ radio.title }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
const img = useImage();

interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  sources: {
    audio: string;
    video?: string;
  }
}

const radios: PlayerTrack[] = [{
  id: "radio-101",
  title: "Radio 101",
  artist: "Milano, Italy",
  cover: "/images/r101.png",
  sources: {
    audio: "http://icecast.unitedradio.it/r101"
  }
}, {
  id: "radio-rds",
  title: "RDS - Radio Dimensione Suono",
  artist: "Rome, Italy",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmXRgxmM8cLpZKJF4mgVPePgCBK1QCAnyfLg32jwqaJxm1",
  sources: {
    audio: "https://icstream.rds.radio/rds"
  }
}, {
  id: "radio-ibiza",
  title: "Radio Ibiza",
  artist: "Radio Ibiza",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmbLBZ3i2hoXjArVyPxny145fh5LD33hbC8gJfB3UVn4yg",
  sources: {
    audio: "https://ice02.fluidstream.net/ibiza.aac"
  }
}, {
  id: "radio-freccia",
  title: "Radio Freccia",
  artist: "Radio Freccia",
  cover: "https://ipfs-1.bitsong.network/ipfs/QmeuWhWd5EyPbjabCF5kF1yg2kSLRwywTqwePhR5hM8oTw",
  sources: {
    audio: "https://dd782ed59e2a4e86aabf6fc508674b59.msvdn.net/live/S3160845/D6MENOraq6Qy/playlist_audio.m3u8"
  }
}, {
  id: 'radio-m2o',
  title: 'Radio M2O',
  artist: 'Rome, Italy',
  cover: 'https://ipfs-1.bitsong.network/ipfs/QmbKQYBtgXgRm18MWZBA37XWLSz7yuozzZZzHFFVMmCue1',
  sources: {
    audio: "https://4c4b867c89244861ac216426883d1ad0.msvdn.net/radiom2o/radiom2o/master_ma.m3u8"
  }
}, {
  id: 'radio-subasio',
  title: 'Radio Subasio',
  artist: 'Rome, Italy',
  cover: 'https://ipfs-1.bitsong.network/ipfs/QmNkmywWitbAwogeNSFPWyNFBHNr85JavmDoiRtYy11Cyk',
  sources: {
    audio: "https://icy.unitedradio.it/Subasio.mp3"
  }
}, {
  id: 'radio-monte-carlo',
  title: 'Radio Monte Carlo',
  artist: '105.5 FM',
  cover: 'https://play-lh.googleusercontent.com/9XxJ7JX-1zJWGRn9B8H7R7c9Z2UiWe2eBhHKahS7Z7RGFLwMOygIIQly_ieBIwL83g',
  sources: {
    audio: "https://icy.unitedradio.it/RMC.aac"
  }
}, {
  id: '404-deep-radio',
  title: '404 Deep Radio',
  artist: 'Spain',
  cover: 'https://static.mytuner.mobi/media/tvos_radios/HuP2FvedHF.png',
  sources: {
    audio: "https://sonic.mediacp.eu/8116/stream"
  }
}, {
  id: 'tomorrowland-oneworld',
  title: 'Tomorrowland One World Radio',
  artist: 'Belgium',
  cover: 'https://bitsong.studio/images/radio/tomorrowland_oneworld.png',
  sources: {
    audio: "https://28953.live.streamtheworld.com/OWR_INTERNATIONAL.mp3"
  }
}, {
  id: 'tomorrowland-daybreak',
  title: 'Tomorrowland Daybreak Sessions',
  artist: 'Belgium',
  cover: 'https://bitsong.studio/images/radio/tomorrowland_daybreak.png',
  sources: {
    audio: "https://22183.live.streamtheworld.com/OWR_DAYBREAK.mp3"
  }
}, {
  id: 'tomorrowland-anthems',
  title: 'Tomorrowland Anthems',
  artist: 'Belgium',
  cover: 'https://bitsong.studio/images/radio/tomorrowland_anthems.png',
  sources: {
    audio: "https://25453.live.streamtheworld.com/OWR_DAB.mp3"
  }
}]

const { playRadio } = usePlayer()

function play(id: string) {
  const radio = radios.find(r => r.id == id)
  if (!radio) return

  playRadio(radio)
}
</script>