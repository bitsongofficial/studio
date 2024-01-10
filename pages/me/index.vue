<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" />

      <AppNftTokenGrid class="mt-4" :items="data" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"]
});

const user = useUserState()

const { data, error } = useFetch("/api/me/nfts", {
  transform: (data) => data.map((item) => {
    return {
      nft: item.nft_id,
      nftName: item.nft_name,
      tokenId: item.token_id,
      tokenName: `#${item.token_id}`,
      image: item.nft_image,
    }
  })
})

if (error.value) {
  navigateTo("/")
}

</script>