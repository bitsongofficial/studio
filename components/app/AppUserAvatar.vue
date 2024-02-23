<template>
  <v-avatar :size="size">
    <!--<v-img :src="img(avatar, { width: size, height: size, fit: 'cover' })" :height="size" :width="size" cover></v-img>-->
    <NuxtImg :src="avatar" :width="size" :height="size" cover />
  </v-avatar>
</template>

<script lang="ts" setup>
interface Props {
  avatar?: string | null;
  size?: number;
}

const { baseUrl } = useRuntimeConfig().public

const props = withDefaults(defineProps<Props>(), {
  size: 36
});

const img = useImage();

const url = useRuntimeConfig().public.ipfsGateway
const avatar = computed(() => {
  if (props.avatar) {
    return url.replace('{cid}', props.avatar)
  }
  return `${baseUrl}/images/default.png`
})
</script>