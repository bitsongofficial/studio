<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h3 font-weight-bold">Marketplace</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Set the parameters of the marketplace</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="7">
        <v-container>

          <v-row no-gutters justify="center">
            <v-col cols="6">
              <v-card-title>Creator Fee</v-card-title>
              <v-card-subtitle>Percentage of the fee that the creator will receive</v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="outlined" class="mt-3" v-model="modelValue.creatorFee" type="number">
                <template #append-inner>
                  %
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="6">
              <v-card-title>Referral Fee</v-card-title>
              <v-card-subtitle>Percentage of the fee that the referrer will receive</v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="outlined" class="mt-3" v-model="modelValue.creatorFee" type="number">
                <template #append-inner>
                  %
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="6">
              <v-card-title>Curve Ratio</v-card-title>
              <v-card-subtitle>TODO: add description</v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="outlined" class="mt-3" v-model="modelValue.curveRatio" type="number">
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>




        <v-container>

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
export interface MarketPlace {
  creatorFee?: number;
  referralFee?: number;
  releaseDate?: Date;
  curveRatio?: number;
  maxPerAddress?: number;
  maxEditions?: number;
}

const emits = defineEmits<{
  'update:modelValue': [payload: MarketPlace];
  "done": [];
}>();

function onDone() {
  emits("done");
}

const props = defineProps<{ modelValue: MarketPlace }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const startTime = ref();

const setStartTime = (value: any) => {
  startTime.value = value;
}
</script>
