<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h4 text-md-h3 font-weight-bold">Wen release? 🚀</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Set the date and time of the release of your Music NFT</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="12" md="7">
        <v-row justify="space-around">
          <v-date-picker v-if="date" v-model="date" :min="minDate" show-adjacent-months color="primary"
            class="date-picker"></v-date-picker>

          <v-col cols="12" md="4">
            <v-row justify="left" align="center" class="pt-9 pb-2">
              <v-col cols="auto" class="d-flex align-center">
                <div class="text-h4 px-4">Time</div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="left" align="center">
              <v-col class="text-center" cols="auto">
                <v-btn @click.stop="increaseHours" icon="mdi-chevron-up" size="x-large" variant="text"
                  color="surface-variant"></v-btn>
                <div class="text-h2 pa-3">{{ hours }}</div>
                <v-btn @click.stop="decreaseHours" icon="mdi-chevron-down" size="x-large" variant="text"
                  color="surface-variant"></v-btn>
              </v-col>
              <v-col class="text-center" cols="auto">
                <div class="text-h2 text-surface-variant pa-3">
                  :
                </div>
              </v-col>
              <v-col class="text-center" cols="auto">
                <v-btn @click.stop="increaseMinutes" icon="mdi-chevron-up" size="x-large" variant="text"
                  color="surface-variant"></v-btn>
                <div class="text-h2 pa-3">{{ minutes }}</div>
                <v-btn @click.stop="decreaseMinutes" icon="mdi-chevron-down" size="x-large" variant="text"
                  color="surface-variant"></v-btn>
              </v-col>
              <v-col cols="auto" class="text-surface-variant">
                {{ amPm }}
              </v-col>
            </v-row>

            <v-row>
              <v-col class="text-right">
                <v-btn :loading="loading" @click="onContinue">Continue</v-btn>
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  'update:modelValue': [payload: number];
  "done": [];
}>();

const error = ref("");
const loading = ref(false);

const props = defineProps<{ modelValue?: number, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const date = computed({
  get() {
    return modelValue.value ? new Date(modelValue.value * 1000) : new Date();
  },
  set(value: Date) {
    let adjustedHours = hours.value;
    if (amPm.value === "PM" && adjustedHours < 12) {
      adjustedHours += 12;
    } else if (amPm.value === "AM" && adjustedHours === 12) {
      adjustedHours = 0;
    }
    const newDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), adjustedHours, minutes.value);
    modelValue.value = Math.floor(newDate.getTime() / 1000);
  }
});

const hours = computed(() => {
  const hours = date.value.getHours();
  return hours > 12 ? hours - 12 : hours;
})

const minutes = computed(() => {
  return date.value.getMinutes();
})

const amPm = computed(() => {
  return date.value.getHours() > 12 ? "PM" : "AM";
})

function increaseHours() {
  if (modelValue.value) {
    modelValue.value += 3600;
  }
}

function decreaseHours() {
  if (modelValue.value) {
    modelValue.value -= 3600;
  }
}

function increaseMinutes() {
  if (modelValue.value) {
    modelValue.value += 60;
  }
}

function decreaseMinutes() {
  if (modelValue.value) {
    modelValue.value -= 60;
  }
}

const minDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
})

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
        start_time: toValue(modelValue)
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

<style>
.date-picker {
  background-color: transparent !important;
}

.v-date-picker--month.date-picker>div.bg-primary {
  background-color: transparent !important;
}

.v-date-picker--month.date-picker>div.bg-primary>div.v-picker__header>div {
  background-color: transparent !important;
}
</style>