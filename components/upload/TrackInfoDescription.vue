<template>
  <v-container class="pa-1">
    <v-row class="pt-1">
      <v-col>
        <v-textarea auto-grow label="Description" variant="outlined" v-model="modelValue" rows="10"></v-textarea>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col>
        <v-alert variant="outlined" type="error">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-right">
        <v-btn @click="onBack" class="mr-4" variant="text" color="surface-variant">Back</v-btn>
        <v-btn :loading="loading" @click="onContinue">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const error = ref("");
const loading = ref(false);

const emits = defineEmits<{
  'update:modelValue': [payload: string];
  "done": [];
  "back": [];
}>()

const props = defineProps<{ modelValue?: string, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

function onBack() {
  emits("back");
}

async function onContinue() {
  error.value = "";
  loading.value = true;

  try {
    await $fetch(`/api/me/tracks/${props.trackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        description: modelValue.value
      }
    })

    emits("done");
  } catch (e) {
    error.value = e.data.message;
  } finally {
    loading.value = false;
  }
}
</script>
