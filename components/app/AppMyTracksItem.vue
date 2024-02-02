<template>
  <v-card rounded="lg" width="230" color="black">
    <NuxtLink :to="link" class="text-decoration-none text-white">
      <v-img height="230" width="230" :src="img(image, { width: 230, height: 230, fit: 'cover' })"
        gradient="to bottom, rgba(0,0,0,.10), rgba(0,0,0,.7)">
      </v-img>
    </NuxtLink>
    <v-card-subtitle class="mt-2 text-caption">
      <NuxtLink :to="link" class="text-decoration-none text-white">
        {{ subtitle }}
      </NuxtLink>
    </v-card-subtitle>
    <v-card-title class="mt-n2">
      <NuxtLink :to="link" class="text-decoration-none text-white">
        {{ title }}
      </NuxtLink>
    </v-card-title>
    <v-chip class="my-2 mx-4" v-if="status">{{ status }}</v-chip>
    <v-btn color="primary" class="mt-2" block variant="outlined" :to="link">
      {{ btnText }}
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
const img = useImage();

interface Props {
  image: string;
  subtitle: string;
  title: string;
  link: string;
  btnText: string;
  status?: string;
}

const props = withDefaults(defineProps<Props>(), {
  image: '',
  subtitle: '',
  title: '',
  link: '',
  btnText: ''
})
</script>