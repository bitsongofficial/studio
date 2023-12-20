<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"]
});

const user = useUserState()
</script>