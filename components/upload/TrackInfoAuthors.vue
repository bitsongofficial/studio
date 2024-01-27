<template>
  <v-container class="pa-1">
    <v-card-title class="px-0 pt-0 mb-4">Authors & Publishers</v-card-title>
    <v-row v-for="(ap, index) in modelValue" :key="index" align="center" no-gutters>
      <v-col>
        <v-row>
          <v-col>
            <v-text-field label="Name" variant="outlined" v-model="ap.name"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select variant="outlined" :items="publisherRoles" label="Role" append-inner-icon="mdi-menu-down"
              v-model="ap.role"></v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field label="BitSong Address" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" v-if="modelValue.length > 1">
        <v-btn variant="text" color="surface-variant" icon="mdi-delete" @click="remove(index)"></v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="canAdd">
      <v-col>
        <v-btn @click="add">Add Author & Publisher</v-btn>
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
export interface AuthorPublisher {
  role?: string;
  name?: string;
  address?: string;
}

const emits = defineEmits<{
  'update:modelValue': [payload: AuthorPublisher[]];
  "done": [];
}>()

const props = defineProps<{ modelValue: AuthorPublisher[] }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const publisherRoles = [
  "Author",
  "Composer",
  "Publisher",
  "Producer",
  "Executive Producer",
  "Co-Producer",
  "Remixer",
  "Arranger",
]

const canAdd = computed(() => modelValue.value.length === 0 || modelValue.value[modelValue.value.length - 1].role && modelValue.value[modelValue.value.length - 1].name);

function add() {
  modelValue.value.push({
    role: "",
    name: "",
    address: ""
  });
}

function remove(index: number) {
  modelValue.value.splice(index, 1);
}

function onDone() {
  emits("done");
}
</script>
