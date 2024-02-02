<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="auto" v-for="track in tracks" :key="track.id">
        <AppMyTracksItem :image="track.artwork!" :subtitle="``" :title="track.title || '-'" :link="getTrackLink(track)"
          :btnText="getButtonText(track)" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup>
const { data: tracks, error } = await useFetch(`/api/me/tracks`)

function getTrackLink(track: { id: string; status: string, nft_address?: string }) {
  if (track.status.toLowerCase() === 'draft') {
    return `/me/tracks/${track.id}/edit`
  }

  if (track.status.toLowerCase() === 'to_mint') {
    return `/me/tracks/${track.id}/mint`
  }

  return `/nfts/${track.nft_address}`
}

function getButtonText(track: { status: string }) {
  if (track.status.toLowerCase() === 'draft') {
    return 'Continue Edit'
  }

  if (track.status.toLowerCase() === 'to_mint') {
    return 'Mint as Music NFT'
  }

  return 'View Music NFT'
}
</script>