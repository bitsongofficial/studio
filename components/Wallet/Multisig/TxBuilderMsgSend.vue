<template>
  <v-card>{{ data }}</v-card>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: {
    [key: string]: any
  }
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)
</script>