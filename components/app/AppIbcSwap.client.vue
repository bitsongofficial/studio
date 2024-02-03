<template>
  <v-dialog v-if="!mobile" persistent width="435" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <AppIbcSwapCard v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </v-dialog>
  <v-bottom-sheet v-else v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <AppIbcSwapCard v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { mobile } = useDisplay()
</script>