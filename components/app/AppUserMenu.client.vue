<template>
  <div v-if="connected" class="d-flex align-center">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-list width="210" :style="{ cursor: 'pointer' }" v-bind="props" bg-color="transparent" variant="text"
          density="comfortable" rounded="pill">
          <v-list-item :prepend-avatar="avatar" :title="name" subtitle="0 BTSG">
          </v-list-item>
        </v-list>
      </template>

      <v-card min-width="300">
        <div class="py-3 text-center flex-grow-1">
          <v-avatar size="80" @click.stop="navigateTo('/profile')" :style="{ cursor: 'pointer' }">
            <v-img :src="avatar" :alt="accountName"></v-img>
          </v-avatar>
          <v-card-title @click.stop="navigateTo('/profile')" :style="{ cursor: 'pointer' }">
            {{ name }}
          </v-card-title>
          <v-card-subtitle :style="{ marginTop: '-6px' }">
            {{ accountName }}
          </v-card-subtitle>
          <v-card-subtitle v-if="user?.username">
            {{ formatShortAddress(address, 6) }}
          </v-card-subtitle>
          <v-btn icon="mdi-refresh" size="small" variant="text" rounded="pill" color="grey-lighten-1"></v-btn>
          <AppCopyBtn v-if="address" :text="address" />
        </div>
        <v-divider></v-divider>
        <v-list density="comfortable">
          <v-list-item append-icon="mdi-account" to="/profile">
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item>
          <v-list-item append-icon="mdi-cogs" to="/settings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn @click.stop="disconnect" prepend-icon="mdi-logout" block rounded="pill" variant="outlined"
            color="primary">Disconnect</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import defaultImage from "@/assets/images/default.png";
const { address, accountName } = useChain("bitsong")
const { disconnect, connected } = useConnect();

const menu = ref(false);
const user = await useUser();

useWalletEvents("keystorechange", () => {
  disconnect()
});

const avatar = computed(() => {
  if (user.value?.avatar) return useIpfsLink(user.value.avatar)
  return defaultImage
})

const name = computed(() => {
  if (user.value?.username) return user.value.username
  return formatShortAddress(toValue(address), 6)
})
</script>