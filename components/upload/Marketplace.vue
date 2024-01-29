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
          <v-row no-gutters justify="center" align="center">
            <v-col cols="6">
              <v-card-title>Curve Ratio</v-card-title>
              <v-card-subtitle>TODO: aggiungere descrizione e link di spiegazione</v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-slider v-model="modelValue.creatorFee" :min="0.5" :max="7.5" :step="0.5"></v-slider>
                </v-col>
                <v-col cols="6">
                  <div class="text-center text-h4 text-surface-variant">
                    {{ modelValue.creatorFee }} <span class="text-h6">%</span>
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-chip color="green" v-if="modelValue.creatorFee! <= 2.5">Reccomended</v-chip>
                  <v-chip color="yellow"
                    v-if="modelValue.creatorFee! > 2.5 && modelValue.creatorFee! <= 5">Medium</v-chip>
                  <v-chip color="red" v-if="modelValue.creatorFee! > 5">Not Reccomended</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col cols="10">
              <v-alert class="pb-2">
                <v-row align="center">
                  <v-col>
                    <v-card-title class="pt-0">Simulazione</v-card-title>
                    <v-card-text>
                      Esegui una simulazione con questi parametri, TODO continuare descrizione
                    </v-card-text>
                  </v-col>
                  <v-col cols="2" class="text-right">
                    <v-btn variant="text" color="white" icon="mdi-arrow-right" @click="onDone"></v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>


          <v-row no-gutters justify="center" align="center">
            <v-col cols="6">
              <v-card-title>Creator Fee</v-card-title>
              <v-card-subtitle>Percentage of the fee that the creator will receive</v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-slider v-model="modelValue.creatorFee" :min="0.5" :max="7.5" :step="0.5"></v-slider>
                </v-col>
                <v-col cols="6">
                  <div class="text-center text-h4 text-surface-variant">
                    {{ modelValue.creatorFee }} <span class="text-h6">%</span>
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-chip color="green" v-if="modelValue.creatorFee! <= 2.5">Reccomended</v-chip>
                  <v-chip color="yellow"
                    v-if="modelValue.creatorFee! > 2.5 && modelValue.creatorFee! <= 5">Medium</v-chip>
                  <v-chip color="red" v-if="modelValue.creatorFee! > 5">Not Reccomended</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row no-gutters justify="center" align="center">
            <v-col cols="6">
              <v-card-title>Referral Fee</v-card-title>
              <v-card-subtitle>TODO: Percentage of the fee that the creator will receive</v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-slider v-model="modelValue.referralFee" :min="0.1" :max="1.5" :step="0.1"></v-slider>
                </v-col>
                <v-col cols="6">
                  <div class="text-center text-h4 text-surface-variant">
                    {{ modelValue.referralFee }} <span class="text-h6">%</span>
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-chip color="green" v-if="modelValue.referralFee! <= 2.5">Reccomended</v-chip>
                  <v-chip color="yellow"
                    v-if="modelValue.referralFee! > 2.5 && modelValue.referralFee! <= 5">Medium</v-chip>
                  <v-chip color="red" v-if="modelValue.referralFee! > 5">Not Reccomended</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col cols="10">
              <v-alert>
                <v-card-title class="pt-0">Example</v-card-title>
                <v-card-text>
                  Se qualcuno compra o vende e tu sei solo otterrai il X. Se qualcuno compra o vende e tu sei
                  con un referrer otterrai il X - Y.
                </v-card-text>
              </v-alert>
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
