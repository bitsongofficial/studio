<template>
  <app-page>
    <template #body>
      <v-container v-if="isLoading">
        <v-row align="center">
          <v-col cols="auto">
            <v-skeleton-loader width="300" height="300" type="image"></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader max-width="500" type="article"></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-skeleton-loader type="article"></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-skeleton-loader type="article"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row align="center">
          <v-col cols="auto">
            <NuxtImg :src="useIpfsLink(data?.image || '')" height="265" width="265" cover />
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col>
                <h1 class="text-h3 font-weight-medium">{{ data?.name }}</h1>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-6">
              <v-col class="text-surface-variant text-body-1">
                {{ data?.symbol }}
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-surface-variant">
                <v-btn color="primary" @click.stop="onTranscode" :loading="isTranscoding">Transcode</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Track Details</v-card-title>
              <v-container>
                <v-row no-gutters>
                  <v-col cols="12">
                    {{ data?.uri }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Metadata Uri
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters class="mt-2">
                  <v-col cols="12">
                    <vue-json-pretty :data="metadata" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const { $studio } = useNuxtApp();

const nftId = computed(() => useRoute().params.id as string)

const queryFn = async () => {
  return await $studio.admin.nfts.get.query({
    id: nftId.value
  })
}

const { isLoading, isPending, isFetching, isError, data, error, suspense } = useQuery({
  queryKey: ['admin', 'nft', nftId],
  queryFn
})

watch(isError, (value) => {
  if (value) {
    navigateTo('/admin/nfts')
  }
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

const { data: metadata, refetch } = useQuery({
  queryKey: ['admin', 'nft', nftId, 'metadata'],
  queryFn: async () => {
    return await $studio.admin.nfts.metadata.query({
      id: nftId.value
    })
  }
})

const isTranscoding = ref(false)
const { success, error: errorNotify } = useNotify()
async function onTranscode() {
  try {
    isTranscoding.value = true

    await $studio.admin.nfts.transcode.mutate({
      id: nftId.value
    })

    success('NFT transcoded successfully')
    //navigateTo('/admin/tracks')
  } catch (error) {
    console.error(error)
    errorNotify(`Failed to transcode NFT: ${(error as Error).message}`)
  } finally {
    isTranscoding.value = false
  }
}

</script>

<style>
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: #121212;
  cursor: pointer;
}
</style>