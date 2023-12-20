<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="10">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Episodes</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn size="large" to="/create/podcast/episode">Create Episode</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row v-if="data.length === 0" class="d-flex align-center justify-center">
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
                <tr v-for="item in data" :key="item.name">
                  <td class="pa-6 text-body-1">{{ item.name }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ item.status }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ item.format }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ item.length }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '150px' }">{{ item.plays }}</td>
                  <td class="text-grey-lighten-1 text-center" :style="{ width: '100px' }">{{ item.date }}</td>
                  <td class="text-grey-lighten-1 text-right" :style="{ width: '50px' }">
                    <v-btn variant="text" color="grey-lighten-1" icon="mdi-dots-vertical">

                    </v-btn>
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
interface Episode {
  id: string;
  name: string;
  status: string;
  format: string;
  length: number;
  plays: number;
  date: string;
}

const data: Episode[] = [
  {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  }, {
    id: '1',
    name: 'Episode 1',
    status: 'Draft', //'Published',
    format: 'Audio',
    length: 123,
    plays: 0,
    date: new Date().toLocaleDateString(),
  },
]
</script>