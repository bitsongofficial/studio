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
            <v-select variant="outlined" :items="publisherRoles" item-title="text" item-value="value" label="Role"
              append-inner-icon="mdi-menu-down" v-model="ap.role"></v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field label="BitSong Address" v-model="ap.address" variant="outlined"></v-text-field>
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
import { bitsongAddressSchema, nonEmptyStringSchema } from '@bitsongjs/metadata';
import { z } from 'zod'
export interface AuthorPublisher {
  role?: string;
  name?: string;
  address?: string;
}

const emits = defineEmits<{
  'update:modelValue': [payload: AuthorPublisher[]];
  "done": [];
  "back": [];
}>()

const error = ref("");
const loading = ref(false);

const props = defineProps<{ modelValue: AuthorPublisher[], trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const publisherRoles = [{
  value: 'Arranger',
  text: 'Arranger'
}, {
  value: 'Composer',
  text: 'Composer'
}, {
  value: 'Lyricist',
  text: 'Lyricist'
}, {
  value: 'Producer',
  text: 'Producer'
}, {
  value: 'Publisher',
  text: 'Publisher'
}, {
  value: 'Songwriter',
  text: 'Songwriter'
}]

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

function onBack() {
  emits("back");
}

const FormSchema = z.array(
  z.object({
    name: nonEmptyStringSchema('The name of the author or publisher.'),
    role: z.string().min(1, {
      message: 'You must select a role.'
    }).refine((role) => {
      return publisherRoles.map(r => r.value).includes(role)
    }, {
      message: 'You must select a valid role.'
    }),
    address: bitsongAddressSchema(),
  })
).nonempty({
  message: 'You must add at least one author or publisher.'
})

async function onContinue() {
  error.value = "";
  loading.value = true;

  try {
    const data = FormSchema.safeParse(modelValue.value);
    if (!data.success) {
      error.value = data.error.errors[0].message;
      return
    }

    await $fetch(`/api/me/tracks/${props.trackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        authors_publishers: modelValue.value.filter(ap => ap.name && ap.role && ap.address)
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
