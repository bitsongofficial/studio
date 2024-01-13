<template>
  <v-container fluid class="v-col-12 pa-0 v-col-md-10 fill-height justify-center align-center py-16">
    <v-row>
      <v-col class="text-center">
        <v-img class="mx-auto mb-8" width="60" height="60" :src="logoCircleEmail"></v-img>

        <h1 v-if="data" class="text-center my-8">{{ data.message }}</h1>
        <v-btn v-if="data" size="large" @click.stop="redirect">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import logoCircleEmail from '@/assets/images/logo-circle-email.png'

definePageMeta({
  layout: 'empty',
})

const token = useRoute().query.token as string

if (!token || token === '') {
  navigateTo('/')
}

const { data } = await useFetch(`/api/confirm_email`, {
  method: 'PUT',
  body: JSON.stringify({ token }),
})

function redirect() {
  window.location.href = '/'
}
</script>