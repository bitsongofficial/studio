<template>
  <div v-if="connected" class="d-flex align-center">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-list width="210" :style="{ cursor: 'pointer' }" v-bind="props" bg-color="transparent" variant="text"
          density="comfortable" rounded="pill">
          <v-list-item :prepend-avatar="avatar" :title="name" :subtitle="formattedBalance">
          </v-list-item>
        </v-list>
      </template>

      <v-card min-width="300">
        <div class="py-3 text-center flex-grow-1">
          <v-avatar size="80" @click.stop="navigateTo('/me')" :style="{ cursor: 'pointer' }">
            <v-img :src="avatar" :alt="accountName" cover></v-img>
          </v-avatar>
          <v-card-title @click.stop="navigateTo('/me')" :style="{ cursor: 'pointer' }">
            {{ name }}
          </v-card-title>
          <v-card-subtitle :style="{ marginTop: '-6px' }">
            {{ accountName }}
          </v-card-subtitle>
          <v-card-subtitle v-if="user?.username">
            {{ formatShortAddress(address, 6) }}
          </v-card-subtitle>
          <v-btn icon="mdi-refresh" :loading="loading" size="small" variant="text" rounded="pill" color="grey-lighten-1"
            @click.stop="fetchBalance"></v-btn>
          <AppCopyBtn v-if="address" :text="address" />
        </div>
        <v-divider></v-divider>
        <v-list density="comfortable">
          <v-list-item append-icon="mdi-account" to="/me">
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item>
          <v-list-item append-icon="mdi-music" to="/me/tracks">
            <v-list-item-title>My Tracks</v-list-item-title>
          </v-list-item>
          <v-list-item append-icon="mdi-bank" to="/me/assets">
            <v-list-item-title>My Assets</v-list-item-title>
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
const { balance, formattedBalance, loading, fetchBalance: _fecthBalance } = useUserBalance();

// const userBalance = ref<number>(0);
//const loadingBalance = ref(false);

useWalletEvents("keystorechange", () => {
  disconnect()
});

//const client = await useQueryClient("bitsong")

async function fetchBalance() {
  await _fecthBalance(address)
}

watch(connected, async (val) => {
  if (val) {
    await fetchBalance()
  }
}
)

// async function fetchBalance() {
//   loadingBalance.value = true
//   try {
//     const balance = await client.getBalance(address.value!, "ubtsg")
//     userBalance.value = parseInt(balance.amount)
//   } catch (e) {
//     console.error(e)
//   } finally {
//     loadingBalance.value = false
//   }
// }

const avatar = computed(() => {
  if (user.value?.avatar) return useIpfsLink(user.value.avatar)
  return defaultImage
})

const name = computed(() => {
  if (user.value?.username) return user.value.username
  return formatShortAddress(toValue(address), 6)
})

// const balance = computed(() => {
//   if (userBalance.value) return `${useFromMicroAmount(userBalance.value)} BTSG`
//   return "0 BTSG"
// })

onMounted(async () => {
  if (connected.value) {
    await fetchBalance()
  }
})
</script>