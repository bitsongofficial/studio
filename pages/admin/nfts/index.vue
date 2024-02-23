<template>
  <app-page>
    <template #title>
      NFTs
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row>
          <v-col>
            <v-tabs v-model="status">
              <v-tab value="All">All</v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="7">
            <v-row>
              <v-col class="ml-auto" cols="auto">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn class="mt-2" color="primary" v-bind="props" append-icon="mdi-chevron-down">
                      {{ orderBy }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item :append-icon="orderBy === 'Newest' ? 'mdi-check' : ''" @click.stop="orderBy = 'Newest'">
                      <v-list-item-title>Newest</v-list-item-title>
                    </v-list-item>
                    <v-list-item :append-icon="orderBy === 'Oldest' ? 'mdi-check' : ''" @click.stop="orderBy = 'Oldest'">
                      <v-list-item-title>Oldest</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-card :disabled="isDataLoading">
              <v-table hover>
                <thead>
                  <tr>
                    <th :style="{ width: '550px' }">Title</th>
                    <th :style="{ width: '400px' }">Creator</th>
                    <th>Minted at</th>
                    <th :style="{ width: '50px' }"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="nft in data" :key="nft.id" :style="{ cursor: 'pointer' }"
                    @click.stop="navigateTo(`/admin/nfts/${nft.id}`)">
                    <td>
                      <div class="d-flex align-center">
                        <div>
                          <NuxtImg :src="useIpfsLink(nft.image || '')" height="80" width="80" cover class="mt-2">
                          </NuxtImg>
                        </div>
                        <div class="ml-2">
                          <div class="text-body-1">{{ nft.name || '-' }}</div>
                          <!--<div class="text-subtitle-2 text-surface-variant">{{ track.artists.map(artist =>
                            artist.name).join(', ') || '-' }}
                          </div>
                          <div class="text-subtitle-2 text-surface-variant">{{ track.genre || '-' }} | {{
                            useTrackDuration(track.duration) }}</div>
                            -->
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <div>
                          <AppUserAvatar :avatar="nft.user?.avatar" :size="42" />
                        </div>
                        <div class="ml-2 text-subtitle-1">
                          {{ nft.user?.username ? nft.user?.username : formatShortAddress(nft.sender!, 8) }}
                        </div>
                      </div>
                    </td>
                    <td>{{ new Date(nft.timestamp!).toLocaleDateString() }}</td>
                    <td>
                      <v-menu close-on-content-click>
                        <template v-slot:activator="{ props }">
                          <v-btn size="small" color="surface-variant" v-bind="props" icon="mdi-dots-vertical"
                            variant="text"></v-btn>
                        </template>
                      </v-menu>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="recordsTotal && recordsTotal > 0">
          <v-col class="ml-auto" cols="3">
            <v-row align="center">
              <v-col cols="1" class="mr-auto">
                <v-btn :disabled="page === 1" variant="text" icon="mdi-chevron-left" @click.stop="page--"></v-btn>
              </v-col>
              <v-col cols="6" class="text-center">
                {{ recordFrom }} - {{ recordTo }} of {{ recordsTotal }}
              </v-col>
              <v-col cols="1" class="ml-auto">
                <v-btn :disabled="recordTo >= recordsTotal" variant="text" icon="mdi-chevron-right"
                  @click.stop="page++"></v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { useWindowScroll } from '@vueuse/core'

definePageMeta({
  middleware: ["protected"]
});

const { y } = useWindowScroll()
const route = useRoute();
const router = useRouter();

type StatusParams = "All"
type OrderParams = "Newest" | "Oldest"

const page = computed({
  get: () => route.query.page ? Math.max(1, parseInt(route.query.page as string)) : 1,
  set: async (value) => {
    router.push({
      query: {
        ...route.query,
        page: value
      }
    })
    y.value = 0
  }
})
const status = ref<StatusParams>(route.query.status ? route.query.status as StatusParams : 'All');
const orderBy = ref<OrderParams>(route.query.orderBy ? route.query.orderBy as OrderParams : 'Newest');
const limit = ref(route.query.limit ? parseInt(route.query.limit as string) : 10);

const { $studio } = useNuxtApp();

const { data: nftsCount, refetch: refetchNftsCount } = useQuery({
  queryKey: ['admin', 'nfts', 'count'],
  queryFn: async () => await $studio.admin.nfts.count.query(),
  initialData: {
    total: 0,
  },
  placeholderData: keepPreviousData
})

const queryFn = async () => {
  return await $studio.admin.nfts.list.query({
    page: toValue(page),
    orderBy: toValue(orderBy)
  })
}

const { isLoading, isPending, isFetching, isError, data, error, refetch, suspense } = useQuery({
  queryKey: ['admin', 'nfts', page, orderBy],
  queryFn,
  placeholderData: keepPreviousData
})

onServerPrefetch(async () => {
  await suspense()
})

const isDataLoading = computed(() => toValue(isLoading) || toValue(isPending) || toValue(isFetching))

watch(status, async (newStatus) => {
  router.push({ query: { status: newStatus } })
})

watch(orderBy, async (newOrderBy) => {
  router.push({ query: { orderBy: newOrderBy } })
})

watch(limit, (newLimit) => {
  router.push({ query: { limit: newLimit } })
})

const recordFrom = computed(() => (toValue(page) - 1) * toValue(limit) + 1)
const recordTo = computed(() => toValue(page) * toValue(limit))
const recordsTotal = computed(() => {
  if (status.value === 'All') {
    return nftsCount.value.total
  }
})

onMounted(async () => {
  await refetchNftsCount()
})
</script>