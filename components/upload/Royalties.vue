<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h3 font-weight-bold">Royaltyes</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Indicate the percentage of royalties you want to pay to the
          authors of the track</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="7">
        <v-card v-for="(r, index) in modelValue" :key="index" class="mb-8">
          <v-container>
            <v-row align="center">
              <v-col>
                <v-row>
                  <v-col>
                    <v-text-field label="BitSong Address" variant="outlined" v-model="r.address"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select variant="outlined" :items="royaltiesRoles" label="Role" append-inner-icon="mdi-menu-down"
                      v-model="r.role"></v-select>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="3" class="text-center">
                    <div class="text-h4 d-flex justify-center pt-1">
                      <input type="text" class="text-h4" v-model="r.shares" :style="{ width: '90px' }"
                        @input="validateShares(index)" /> shares
                    </div>

                    <div class="text-h6 text-surface-variant">{{ shareToPercent(r.shares || 0) }}%</div>
                  </v-col>
                  <v-col cols="9">
                    <v-slider class="mt-5" :min="1" :max="1000" v-model="r.shares" :step="1"></v-slider>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="auto" v-if="modelValue.length > 1">
                <v-btn variant="text" color="surface-variant" icon="mdi-delete" @click="remove(index)"></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-container>
          <v-row v-if="canAdd">
            <v-col>
              <v-btn @click="add">Add Royalties Recipient</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn @click="onDone">Continue</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
export interface RoylatiesItem {
  role?: string;
  address?: string;
  shares?: number;
}

const emits = defineEmits<{
  'update:modelValue': [payload: RoylatiesItem[]];
  "done": [];
}>();

function onDone() {
  emits("done");
}

const props = defineProps<{ modelValue: RoylatiesItem[] }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const royaltiesRoles = [
  "Author",
  "Composer",
  "Publisher",
  "Producer",
  "Executive Producer",
  "Other",
];

const canAdd = computed(() => modelValue.value.length === 0 || modelValue.value[modelValue.value.length - 1].role && modelValue.value[modelValue.value.length - 1].shares);

function add() {
  modelValue.value.push({
    role: "",
    shares: 1,
    address: ""
  });
}

function remove(index: number) {
  modelValue.value.splice(index, 1);
}

function shareToPercent(shares: number) {
  const totalShares = modelValue.value.reduce((acc, curr) => acc + (curr.shares ? curr.shares : 0), 0);
  return Math.round((shares / totalShares) * 10000) / 100 || 0;
}

function validateShares(index: number) {
  const shares = modelValue.value[index].shares;
  if (!shares) {
    return
  }

  const sharesString = shares.toString().replace(/\D/g, '');
  const sharesNumber = parseInt(sharesString);

  if (sharesNumber < 1) {
    modelValue.value[index].shares = 1;
  } else if (sharesNumber > 1000) {
    modelValue.value[index].shares = 1000;
  } else if (isNaN(sharesNumber)) {
    modelValue.value[index].shares = 1;
  } else {
    modelValue.value[index].shares = sharesNumber;
  }
}
</script>
