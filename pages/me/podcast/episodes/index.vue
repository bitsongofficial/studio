<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Episodes</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn size="large" to="/create/podcast/episode">Create Episode</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row v-if="episodes && episodes.length === 0" class="d-flex align-center justify-center">
          <v-col class="text-center">
            <v-card variant="text" class="py-12">
              <v-icon size="96" color="grey-lighten-1">mdi-podcast</v-icon>

              <v-card-title class="text-h5 font-weight-bold py-4">Create your first episode!</v-card-title>

              <v-btn>Create Episode</v-btn>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else class="d-flex">
          <v-col>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left text-uppercase text-surface-variant">
                    Name
                  </th>
                  <th class="text-center text-uppercase text-surface-variant">
                    Status
                  </th>
                  <th class="text-center text-uppercase text-surface-variant">
                    Format
                  </th>
                  <th class="text-center text-uppercase text-surface-variant">
                    Length
                  </th>
                  <th class="text-center text-uppercase text-surface-variant">
                    Plays
                  </th>
                  <th class="text-right text-uppercase text-surface-variant">
                    Date
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="episode in episodes" :key="episode.id">
                  <td class="pa-6 text-body-1">{{ episode.name }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ episode.status }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ episode.format }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ episode.length }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ episode.plays }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '100px' }">{{ episode.date }}</td>
                  <td class="text-grey-lighten-1 text-right" :style="{ width: '50px' }">
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn variant="text" color="grey-lighten-1" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item>
                          <v-list-item-title @click.stop="navigateTo(`/me/podcast/episodes/${episode.id}/edit`)"
                            :style="{ cursor: 'pointer' }">
                            Edit Episode
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const { data: episodes, error } = await useFetch('/api/me/podcast/episodes', {
  transform: (data) => {
    return data.episodes.map((item) => {
      return {
        id: item.id,
        name: item.title,
        status: item.status,
        format: 'Audio',
        length: item.length,
        plays: item.plays,
        date: new Date(item.createdAt).toLocaleDateString(),
      }
    })
  }
})

watch(error, (error) => {
  console.error(error)
  navigateTo('/')
})
</script>