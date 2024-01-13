<template>
  <v-app-bar v-if="showAlert" color="red" density="compact">
    <v-list-item>
      Please confirm your email address {{ user?.email_to_verify }}
      <v-btn :loading="status === 'pending'" v-if="canResendEmail" class="ml-2" variant="outlined" size="small"
        color="white" @click="execute">
        resend email
      </v-btn>
    </v-list-item>
    <!--<template #append>
      <v-btn size="small" icon="mdi-close" variant="text"></v-btn>
    </template>-->
  </v-app-bar>
</template>

<script lang="ts" setup>
const user = useUserState()

const showAlert = computed(() => {
  return user.value && !user.value.email_verified && user.value.email_to_verify !== null
})

const canResendEmail = computed(() => {
  return user.value
    && !user.value.email_verified && user.value.email_to_verify !== null
    && user.value.email_verification_sent_at
    && (Date.now() - new Date(user.value.email_verification_sent_at).getTime() > 60 * 1000);
});

const { data, execute, status } = await useLazyFetch(`/api/me/resend_email_confirmation`, {
  method: 'POST',
  immediate: false,
  onResponse() {
    if (!user.value) return
    user.value.email_verification_sent_at = new Date()
  }
})

const { success } = useNotify()

watch(data, (value) => {
  success(value!.message)
})
</script>