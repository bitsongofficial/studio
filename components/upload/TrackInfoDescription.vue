<template>
  <v-container class="pa-1">
    <v-row class="pt-1">
      <v-col>
        <v-textarea auto-grow label="Description" variant="outlined" v-model="modelValue" rows="10"></v-textarea>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="text-right">
        <v-btn @click="onDone">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  'update:modelValue': [payload: string];
  "done": [];
}>()

const props = defineProps<{ modelValue: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

function onDone() {
  emits("done");
}
</script>
