<template>
  <app-page>
    <template #title>
      Tracks
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row>
          <v-col>
            <v-tabs v-model="status">
              <v-tab value="Minted">Minted <v-badge v-if="tracksCount && tracksCount.minted > 0" class="ml-2 mt-n1"
                  color="primary" :content="tracksCount.minted" inline></v-badge></v-tab>
              <v-tab value="To_Mint">To Mint <v-badge v-if="tracksCount && tracksCount.toMint > 0" class="ml-2 mt-n1"
                  color="primary" :content="tracksCount.toMint" inline></v-badge></v-tab>
              <v-tab value="Draft">Draft <v-badge v-if="tracksCount && tracksCount.draft > 0" class="ml-2 mt-n1"
                  color="primary" :content="tracksCount.draft" inline></v-badge></v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="7">
            <v-row>
              <!--<v-col>
                <v-text-field variant="solo-filled" prepend-inner-icon="mdi-magnify"></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn class="mt-2" color="primary" v-bind="props" prepend-icon="mdi-tune">
                      Filter
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>Newest</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Oldest</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Recently Edited</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>-->
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
            <v-card :disabled="isDataLoading || isDeleting" :loading="isDeleting">
              <v-table hover>
                <thead>
                  <tr>
                    <th :style="{ width: '550px' }">Title</th>
                    <th :style="{ width: '400px' }">Creator</th>
                    <th>Status</th>
                    <th>Created at</th>
                    <th :style="{ width: '50px' }"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="track in data" :key="track.id" :style="{ cursor: 'pointer' }"
                    @click.stop="navigateTo(`/admin/tracks/${track.id}`)">
                    <td>
                      <div class="d-flex align-center">
                        <div>
                          <NuxtImg :src="`http://localhost:3000/api/tracks/${track.id}/artwork`" height="80" width="80"
                            cover class="mt-2">
                          </NuxtImg>
                        </div>
                        <div class="ml-2">
                          <div class="text-body-1">{{ track.title || '-' }}</div>
                          <div class="text-subtitle-2 text-surface-variant">{{ track.artists.map(artist =>
                            artist.name).join(', ') || '-' }}
                          </div>
                          <div class="text-subtitle-2 text-surface-variant">{{ track.genre || '-' }} | {{
                            useTrackDuration(track.duration) }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <div>
                          <AppUserAvatar :avatar="track.user.avatar" :size="42" />
                        </div>
                        <div class="ml-2 text-subtitle-1">
                          {{ track.user.username ? track.user.username : formatShortAddress(track.user.address, 8) }}
                        </div>
                      </div>
                    </td>
                    <td>{{ track.status }}</td>
                    <td>{{ new Date(track.created_at).toLocaleDateString() }}</td>
                    <td>
                      <v-menu close-on-content-click>
                        <template v-slot:activator="{ props }">
                          <v-btn size="small" color="surface-variant" v-bind="props" icon="mdi-dots-vertical"
                            variant="text"></v-btn>
                        </template>
                        <v-list>
                          <v-list-item v-if="track.status === 'Draft'" @click="onDeleteTrack(track.id)">
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item>
                        </v-list>
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
import { useQuery } from '@tanstack/vue-query'
import { useWindowScroll } from '@vueuse/core'

definePageMeta({
  middleware: ["protected"]
});

const { y } = useWindowScroll()
const route = useRoute();
const router = useRouter();
const { start, finish } = useLoadingIndicator()

type StatusParams = "Minted" | "To_Mint" | "Draft"
type OrderParams = "Newest" | "Oldest"

const page = computed({
  get: () => route.query.page ? parseInt(route.query.page as string) : 1,
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
const status = ref<StatusParams>(route.query.status ? route.query.status as StatusParams : 'Minted');
const orderBy = ref<OrderParams>(route.query.orderBy ? route.query.orderBy as OrderParams : 'Newest');
const limit = ref(route.query.limit ? parseInt(route.query.limit as string) : 10);

const { $studio } = useNuxtApp();

const { data: tracksCount, refetch: refetchTracksCount } = useQuery({
  queryKey: ['admin', 'tracks', 'count'],
  queryFn: async () => await $studio.admin.tracksCount.query(),
  initialData: {
    minted: 0,
    toMint: 0,
    draft: 0
  }
})

const queryFn = async () => {
  return await $studio.admin.tracks.query({
    limit: toValue(limit),
    page: toValue(page),
    status: toValue(status),
    orderBy: toValue(orderBy)
  })
}

const { isLoading, isPending, isFetching, isError, data, error, refetch } = useQuery({
  queryKey: ['admin', 'tracks', { page: toValue(page), limit: toValue(limit) }],
  queryFn,
  placeholderData: []
})

const isDataLoading = computed(() => toValue(isLoading) || toValue(isPending) || toValue(isFetching))
watch(isDataLoading, (newVal) => {
  if (newVal) {
    start()
  } else {
    finish()
  }
})

// watchEffect(() => {
//   refetch()
// })

watch(page, async () => {
  await refetch()
})

watch(status, async (newStatus) => {
  router.push({ query: { status: newStatus } })
  await refetch()
})

watch(orderBy, async (newOrderBy) => {
  router.push({ query: { orderBy: newOrderBy } })
  await refetch()
})

watch(limit, (newLimit) => {
  router.push({ query: { limit: newLimit } })
})

const recordFrom = computed(() => (toValue(page) - 1) * toValue(limit) + 1)
const recordTo = computed(() => toValue(page) * toValue(limit))
const recordsTotal = computed(() => {
  if (status.value === 'Minted') {
    return tracksCount.value.minted
  }

  if (status.value === 'To_Mint') {
    return tracksCount.value.toMint
  }

  if (status.value === 'Draft') {
    return tracksCount.value.draft
  }
})

onMounted(async () => {
  await refetchTracksCount()
})

const isDeleting = ref(false)
const { success, error: errorNotify } = useNotify()
async function onDeleteTrack(trackId: string) {
  const confirm = window.confirm('Are you sure you want to delete this track? This action cannot be undone.')
  if (!confirm) return

  try {
    //start()
    isDeleting.value = true

    await $studio.admin.trackDelete.mutate({
      id: trackId
    })

    success('Track deleted successfully')
    await refetchTracksCount()
    isDeleting.value = false
    await refetch()
  } catch (error) {
    console.error(error)
    errorNotify(`Failed to delete track: ${(error as Error).message}`)
  } finally {
    isDeleting.value = false
    //finish()
  }
}
</script>