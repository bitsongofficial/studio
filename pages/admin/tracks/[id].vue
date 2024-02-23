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
            <NuxtImg :src="`http://localhost:3000/api/tracks/${trackId}/artwork`" height="265" width="265" cover />
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col>
                <h1 class="text-h3 font-weight-medium">{{ data?.title }}</h1>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-6">
              <v-col class="text-surface-variant text-body-1">
                {{ data?.artists.map(artist => artist.name).join(', ') }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-surface-variant">
                {{ data?.genre }} | {{ useTrackDuration(data?.duration) }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-surface-variant">
                Created by <NuxtLink class="text-white" target="_blank" :to="`/u/${data?.user.address}`">
                  {{ data?.user.username ? data?.user.username : formatShortAddress(data?.user.address, 8) }}
                </NuxtLink>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-surface-variant">
                <v-btn color="red" @click.stop="onDeleteTrack" :loading="isDeleting">Delete Track</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Audio Details</v-card-title>
              <v-container v-if="data?.audio">
                <v-row align="center">
                  <v-col cols="4">
                    <audio controls>
                      <source :src="`http://localhost:3000/api/tracks/${trackId}/audio`"
                        :type="data?.audio_mime_type || 'audio/mpeg'">
                      Your browser does not support the audio element.
                    </audio>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col>
                        {{ data?.audio }}
                        <NuxtLink class="ml-1 text-white" target="_blank" :to="`/api/tracks/${trackId}/audio`">
                          <v-icon size="xs">mdi-open-in-new</v-icon>
                        </NuxtLink>
                        <br>
                        <span class="text-surface-variant text-subtitle-2">
                          S3 Bucket
                        </span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2">
                      <v-col>
                        {{ data?.audio_ipfs_cid }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          IPFS CID
                        </span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2">
                      <v-col>
                        {{ ((data?.size || 0) / 1024 / 1024).toFixed(2) + ' MB' }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Size
                        </span>
                      </v-col>
                      <v-col>
                        {{ useTrackDuration(data?.duration) }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Duration
                        </span>
                      </v-col>
                      <v-col>
                        {{ data?.audio_mime_type }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Mime Type
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Video Details
                <v-btn v-if="data?.video" class="ml-4" prepend-icon="mdi-delete" size="small" color="red"
                  @click.stop="onDeleteVideo" :loading="isDeletingVideo" variant="text">
                  Delete Video
                </v-btn>
              </v-card-title>
              <v-container v-if="!data?.video">
                <v-row>
                  <v-col>
                    No video found
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-row align="center">
                  <v-col cols="4">
                    <video controls playsinline height="280" width="280">
                      <source :src="`http://localhost:3000/api/tracks/${trackId}/video`"
                        :type="data?.video_mime_type || 'video/mp4'">
                      Your browser does not support the video element.
                    </video>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <v-col>
                        {{ data?.video || '-' }}
                        <NuxtLink v-if="data?.video" class="ml-1 text-white" target="_blank"
                          :to="`/api/tracks/${trackId}/video`">
                          <v-icon size="xs">mdi-open-in-new</v-icon>
                        </NuxtLink>
                        <br>
                        <span class="text-surface-variant text-subtitle-2">
                          S3 Bucket
                        </span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2">
                      <v-col>
                        {{ data?.video_ipfs_cid || '-' }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          IPFS CID
                        </span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2">
                      <v-col>
                        {{ ((data?.video_size || 0) / 1024 / 1024).toFixed(2) + ' MB' }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Size
                        </span>
                      </v-col>
                      <v-col>
                        {{ useTrackDuration(data?.video_duration) }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Duration
                        </span>
                      </v-col>
                      <v-col>
                        {{ data?.video_mime_type || '-' }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Mime Type
                        </span>
                      </v-col>
                      <v-col>
                        {{ data?.video_format || '-' }}<br>
                        <span class="text-surface-variant text-subtitle-2">
                          Format
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>


        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Track Details</v-card-title>
              <v-container>
                <v-row>
                  <v-col>
                    {{ data?.titleLocale }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Title Language
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.version }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Track Version
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.user.username ? data?.user.username : formatShortAddress(data?.user.address, 8) }}<br>
                    <span class="text-surface-variant">
                      Created by
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    {{ data?.genre }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Genre
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.country }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Country
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.license }}<br>
                    <span class="text-surface-variant">
                      License
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    {{ useTrackDuration(data?.previewStartTime, { milliseconds: false }) }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Preview start
                    </span>
                  </v-col>
                  <v-col>
                    {{ useTrackDuration(data?.previewDuration) }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Preview duration
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.explicit }}<br>
                    <span class="text-surface-variant">
                      Explicit
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    {{ data?.liveRecording }}<br>
                    <span class="text-surface-variant">
                      Live Recording
                    </span>
                  </v-col>
                  <v-col cols="4">
                    {{ data?.previousRelease }}<br>
                    <span class="text-surface-variant">
                      Previeous Released
                    </span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Marketplace</v-card-title>
              <v-container v-if="!data?.marketplace || data?.marketplace.length === 0">
                <v-row>
                  <v-col>
                    No marketplace data found
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-row>
                  <v-col>
                    {{ data?.marketplace[0].ratio }}<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Curve Ratio
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.marketplace[0].creator_fee }} %<br>
                    <span class="text-surface-variant text-subtitle-2">
                      Creator Fee
                    </span>
                  </v-col>
                  <v-col>
                    {{ data?.marketplace[0].referral_fee }} %<br>
                    <span class="text-surface-variant">
                      Referral Fee
                    </span>
                  </v-col>
                  <v-col>
                    {{
                      data?.start_time ?
                      `${new Date(data?.start_time * 1000).toLocaleDateString()} ${new Date(data?.start_time *
                        1000).toLocaleTimeString()}`
                      : '-'
                    }}<br>
                    <span class="text-surface-variant">
                      Start Time
                    </span>
                  </v-col>
                </v-row>

              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card variant="text">
              <v-card-title class="text-surface-variant">Main Artists</v-card-title>
              <v-table>
                <thead v-if="data?.artists.length">
                  <tr>
                    <th>Artist</th>
                    <th>Role</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="data?.artists.length" v-for="artist in data?.artists" :key="artist.id">
                    <td>{{ artist.name }}</td>
                    <td>{{ artist.role }}</td>
                    <td>{{ artist.address }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="3" class="text-surface-variant text-subtitle-2 text-center">
                      No main artists found
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card variant="text">
              <v-card-title class="text-surface-variant">Authors & Publishers</v-card-title>
              <v-table>
                <thead v-if="data?.authors_publishers.length">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="data?.authors_publishers.length" v-for="author in data?.authors_publishers" :key="author.id">
                    <td>{{ author.name }}</td>
                    <td>{{ author.role }}</td>
                    <td>{{ author.address }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="3" class="text-surface-variant text-subtitle-2 text-center">
                      No authors & publishers found
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card variant="text">
              <v-card-title class="text-surface-variant">Royalties</v-card-title>
              <v-table>
                <thead v-if="data?.royalties_info.length">
                  <tr>
                    <th>Role</th>
                    <th>Shares</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="data?.royalties_info.length" v-for="royalty in data?.royalties_info" :key="royalty.id">
                    <td>{{ royalty.role }}</td>
                    <td>{{ royalty.shares }}</td>
                    <td>{{ royalty.address }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="3" class="text-surface-variant text-subtitle-2 text-center">
                      No royalties found
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>



        <v-row>


          <v-col>
            <v-card variant="text">
              <v-card-title class="text-surface-variant">Description</v-card-title>
              <v-card-text class="text-body-1"
                v-html="marked.parse(data?.description || '*[no description]*')"></v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card variant="text">
              <v-card-title class="text-surface-variant">Lyrics ({{
                data?.lyricsLocale ||
                '-' }})</v-card-title>
              <v-card-text class="text-body-1" v-html="marked.parse(data?.lyrics || '*[no lyrics]*')"></v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { marked } from 'marked'

const { $studio } = useNuxtApp();

const trackId = computed(() => useRoute().params.id as string)

const queryFn = async () => {
  return await $studio.admin.tracks.get.query({
    id: trackId.value
  })
}

const { isLoading, isPending, isFetching, isError, data, error, suspense, refetch } = useQuery({
  queryKey: ['admin', 'track', trackId],
  queryFn
})

watch(isError, (value) => {
  if (value) {
    navigateTo('/admin/tracks')
  }
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

// onMounted(async () => {
//   await refetch()
// })

const isDeleting = ref(false)
const { success, error: errorNotify } = useNotify()
async function onDeleteTrack() {
  const confirm = window.confirm('Are you sure you want to delete this track? This action cannot be undone.')
  if (!confirm) return

  try {
    isDeleting.value = true

    await $studio.admin.tracks.delete.mutate({
      id: trackId.value
    })

    success('Track deleted successfully')
    navigateTo('/admin/tracks')
  } catch (error) {
    console.error(error)
    errorNotify(`Failed to delete track: ${(error as Error).message}`)
  } finally {
    isDeleting.value = false
  }
}

const isDeletingVideo = ref(false)
async function onDeleteVideo() {
  const confirm = window.confirm('Are you sure you want to delete this video? This action cannot be undone.')
  if (!confirm) return

  try {
    isDeletingVideo.value = true

    await $studio.admin.tracks.deleteVideo.mutate({
      id: trackId.value
    })

    success('Video deleted successfully')
    await refetch()
  } catch (error) {
    console.error(error)
    errorNotify(`Failed to delete video: ${(error as Error).message}`)
  } finally {
    isDeletingVideo.value = false
  }
}
</script>