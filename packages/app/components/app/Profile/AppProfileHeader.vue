<template>
  <v-card variant="text" rounded="lg">
    <v-img cover :src="cover" :aspect-ratio="4 / 1"></v-img>
    <div class="d-flex justify-space-between mx-4">
      <v-avatar v-if="!avatar" color="surface-variant" size="125" class="profile-avatar"></v-avatar>
      <v-avatar v-else size="125" class="profile-avatar">
        <v-img :src="avatar" cover :alt="address" :aspect-ratio="1 / 1"></v-img>
      </v-avatar>

      <v-btn v-if="canEdit" rounded="pill" class="mt-4" variant="outlined"
        @click.stop="editProfileDialog = true; umTrackEvent('open-edit-profile')">
        Edit Profile
      </v-btn>
    </div>
  </v-card>
  <v-card variant="text" class="mt-2">
    <v-card-title class="text-h4">
      <div class="d-flex align-center">
        <div class="text-h4" v-if="username">{{ username }}</div>
        <div class="text-h4" v-else>
          {{ formatShortAddress(address, 12) }}
          <AppCopyBtn :text="address" />
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle v-if="username" class="text-h5" :style="{ lineHeight: '1.5rem' }">
      {{ formatShortAddress(address, 12) }}
      <AppCopyBtn :text="address" />
    </v-card-subtitle>
  </v-card>
  <AppProfileEdit v-model="editProfileDialog" :avatar="avatar" :cover="cover" :username="username" :email="email" />
</template>

<script setup lang="ts">
import defaultCover from "~/assets/images/default-cover.png";
import defaultImage from "~/assets/images/default.png";

const user = useUserState()
const canEdit = computed(() => user.value?.address === props.address)

interface Props {
  address: string;
  cover?: string | null;
  avatar?: string | null;
  username?: string | null;
  email?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  cover: undefined,
  avatar: undefined,
  username: undefined,
});

const editProfileDialog = ref(false);

const img = useImage();

const avatar = computed(() => {
  if (props.avatar) return img(useIpfsLink(props.avatar)!, { width: 125, format: 'webp' })
  return defaultImage
})

const cover = computed(() => {
  if (props.cover) return img(useIpfsLink(props.cover)!, { width: 1374, format: 'webp' })
  return defaultCover
})
</script>

<style scoped>
.profile-avatar {
  margin-top: -58px;
  border: 2px solid white;
}
</style>