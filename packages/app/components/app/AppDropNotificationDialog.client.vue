<template>
  <v-dialog persistent width="585" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">

    <v-card :disabled="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title> Get Notified </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pt-0">
        <v-row class="d-flex">
          <v-col cols="3">
            <v-img :src="image" cover></v-img>
          </v-col>
          <v-col col="auto">
            <div class="text-h5">{{ title }}</div>
            <div class="text-body-2">
              {{ subtitle }}
            </div>
            <h2 v-if="remainingTime > 0" class="text-md-h5 text-h6 mt-2">
              <vue-countdown :time="remainingTime" v-slot="{ days, hours, minutes, seconds }">
                <span v-if="days">{{ days }}d</span> {{ hours }}h {{ minutes }}m {{ seconds }}s
              </vue-countdown>
            </h2>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <v-text-field v-model="email" label="Email" variant="outlined"></v-text-field>
      </v-card-text>
      <v-card-text v-if="errorMessage !== ''">
        <v-alert variant="outlined" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-center px-6 py-3">
        <v-spacer></v-spacer>
        <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text" @click.stop="handleClose">
          Cancel
        </v-btn>
        <v-btn :loading="loading" class="w-25 pt-1" rounded="pill" color="primary" variant="flat"
          @click.stop="handleSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import VueCountdown from '@chenfengyuan/vue-countdown';

interface Props {
  modelValue: boolean;
  dropId: string;
  title: string;
  subtitle: string;
  image: string;
  startTime?: number;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "complete"): void;
}>();

const loading = ref(false);
const email = ref("");
const errorMessage = ref("");

const remainingTime = computed(() => {
  if (!props.startTime) {
    return 0
  }

  return (props.startTime - Math.floor(Date.now() / 1000)) * 1000
})

function handleClose() {
  emits("update:modelValue", false);
}

async function handleSave() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await $fetch(`/api/drop_notification/${props.dropId}`, {
      method: "POST",
      body: {
        drop_id: props.dropId,
        email: toValue(email)
      }
    })

    emits("complete");
    handleClose();
    umTrackEvent('enable-drop-notification', { dropId: props.dropId });
  } catch (e) {
    console.log(e)
    errorMessage.value = e.data.message;
  } finally {
    loading.value = false;
  }
}
</script>