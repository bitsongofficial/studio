<template>
  <div>
    <v-btn :size="size" v-if="!data && !complete" block variant="tonal" prepend-icon="mdi-bell" @click.stop="openDialog">
      GET NOTIFIED
    </v-btn>
    <v-btn :size="size" v-if="(data?.drop_id || complete) && connected" :loading="loading" block variant="text"
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
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dropId: '',
  title: '',
  subtitle: '',
  image: '',
  size: undefined
})
const dialog = ref(false);
const loading = ref(false);
const complete = ref(false);
const appConnectDialog = ref(false);

const { data, refresh } = await useFetch(`/api/drop_notification/${props.dropId}`, {
  method: "GET",
  pick: ["drop_id"]
})

watch(connected, (value) => {
  if (value) {
    refresh();
  }
})

function openDialog() {
  if (!connected.value) {
    appConnectDialog.value = true;
    umTrackEvent('open-drop-notification', { dropId: props.dropId, connected: false });
    return;
  }

  dialog.value = true;
  umTrackEvent('open-drop-notification', { dropId: props.dropId, connected: true });
}

async function deleteNotification() {
  loading.value = true;

  try {
    await $fetch(`/api/drop_notification/${props.dropId}`, {
      method: "DELETE"
    })
    complete.value = false;

    umTrackEvent('disable-drop-notification', { dropId: props.dropId });

    await refresh();
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false;
  }
}
</script>