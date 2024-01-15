<template>
  <div>
    <v-btn v-if="!data && !complete" block variant="tonal" prepend-icon="mdi-bell" @click.stop="openDialog">
      GET NOTIFIED
    </v-btn>
    <v-btn v-if="(data?.drop_id || complete) && connected" :loading="loading" block variant="text"
      prepend-icon="mdi-check" @click.stop="deleteNotification">
      TURN OFF ALERT
    </v-btn>
    <AppDropNotificationDialog v-model="dialog" :drop-id="dropId" :title="title" :subtitle="subtitle"
      :start-time="startTime" :image="image" @complete="complete = true" />
    <AppConnectDialog v-model="appConnectDialog" />
  </div>
</template>

<script lang="ts" setup>
const { connected } = useConnect();

interface Props {
  dropId: string;
  title: string;
  subtitle: string;
  image: string;
  startTime?: number;
}

const props = defineProps<Props>();
const dialog = ref(false);
const loading = ref(false);
const complete = ref(false);
const appConnectDialog = ref(false);

const { data, refresh } = await useFetch(`/api/drop_notification/${props.dropId}`, {
  method: "GET",
  pick: ["drop_id"]
})

function openDialog() {
  if (!connected.value) {
    appConnectDialog.value = true;
    return;
  }

  dialog.value = true;
}

async function deleteNotification() {
  loading.value = true;

  try {
    await $fetch(`/api/drop_notification/${props.dropId}`, {
      method: "DELETE"
    })
    complete.value = false;

    await refresh();
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false;
  }
}
</script>