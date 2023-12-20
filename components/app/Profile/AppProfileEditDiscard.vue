<template>
  <v-dialog persistent width="300" :model-value="props.modelValue">
    <v-card>
      <v-card-title>Discard changes</v-card-title>
      <v-card-text class="text-grey-lighten-1">
        This can’t be undone and you’ll lose your changes.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded="pill" variant="text" type="submit" @click.stop="handleCancel">
          Cancel
        </v-btn>
        <v-btn rounded="xl" color="red" variant="flat" @click.stop="handleDiscard">
          Discard
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "discardChanges", value: boolean): void;
}>();

const handleCancel = () => {
  emits("update:modelValue", false);
};

const handleDiscard = () => {
  emits("discardChanges", true);
  emits("update:modelValue", false);
};
</script>