<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h4 text-md-h3 font-weight-bold">Marketplace</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Set the parameters of the marketplace</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="12" md="7">
        <v-container>
          <v-row no-gutters justify="center" align="center">
            <v-col cols="12" md="6">
              <v-card-title>Curve Ratio</v-card-title>
              <v-card-subtitle>TODO: aggiungere descrizione e link di spiegazione</v-card-subtitle>
            </v-col>
            <v-col cols="12" md="4">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-slider v-model="modelValue.curveRatio" :min="1" :max="1000" :step="1"></v-slider>
                </v-col>
                <v-col cols="6">
                  <div class="text-center text-h4 text-surface-variant">
                    {{ modelValue.curveRatio }}
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-n4">
                <v-col>
                  <v-chip color="red" v-if="modelValue.curveRatio! <= 20">Very Aggressive</v-chip>
                  <v-chip color="red"
                    v-if="modelValue.curveRatio! > 20 && modelValue.curveRatio! <= 90">Aggressive</v-chip>
                  <v-chip color="yellow"
                    v-if="modelValue.curveRatio! > 90 && modelValue.curveRatio! <= 250">Medium</v-chip>
                  <v-chip color="green" v-if="modelValue.curveRatio! > 250">Conservative</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="pb-10" justify="center" align="center">
            <v-col cols="12" md="10">
              <v-card class="justify-space-between d-flex align-center">
                <div>
                  <v-card-title>Simulazione</v-card-title>
                  <v-card-text>
                    Esegui una simulazione con questi parametri, TODO continuare descrizione
                  </v-card-text>
                </div>
                <v-spacer></v-spacer>
                <v-btn variant="text" color="white" icon="mdi-arrow-right"></v-btn>
              </v-card>
            </v-col>
          </v-row>


          <v-row no-gutters justify="center" align="center">
            <v-col cols="12" md="6">
              <v-card-title>Creator Fee</v-card-title>
              <v-card-subtitle>Percentage of the fee that the creator will receive</v-card-subtitle>
            </v-col>
            <v-col cols="12" md="4">
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
              <v-row no-gutters class="mt-n4">
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
            <v-col cols="12" md="6">
              <v-card-title>Referral Fee</v-card-title>
              <v-card-subtitle>TODO: Percentage of the fee that the creator will receive</v-card-subtitle>
            </v-col>
            <v-col cols="12" md="4">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-slider v-model="modelValue.referralFee" :min="0.1" :max="maxReferralFee" :step="0.1"></v-slider>
                </v-col>
                <v-col cols="6">
                  <div class="text-center text-h4 text-surface-variant">
                    {{ modelValue.referralFee }} <span class="text-h6">%</span>
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-n4">
                <v-col>
                  <v-chip color="green" v-if="modelValue.referralFee! <= 2.5">Reccomended</v-chip>
                  <v-chip color="yellow"
                    v-if="modelValue.referralFee! > 2.5 && modelValue.referralFee! <= 5">Medium</v-chip>
                  <v-chip color="red" v-if="modelValue.referralFee! > 5">Not Reccomended</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="pt-1" justify="center" align="center">
            <v-col cols="12" md="10">
              <v-card class="justify-space-between d-flex align-center">
                <div>
                  <v-card-title>Esempio</v-card-title>
                  <v-card-text>
                    TODO: aggiungere esempio. Se qualcuno compra o vende e tu sei solo otterrai il X. Se qualcuno compra o
                    vende e tu sei
                    con un referrer otterrai il X - Y.
                  </v-card-text>
                </div>
              </v-card>
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
              <v-btn :loading="loading" @click="onContinue">Continue</v-btn>
            </v-col>
          </v-row>


        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { z } from 'zod'

export interface MarketPlace {
  creatorFee?: number;
  referralFee?: number;
  releaseDate?: number;
  curveRatio?: number;
  maxPerAddress?: number;
  maxEditions?: number;
}

const error = ref("");
const loading = ref(false);

const emits = defineEmits<{
  'update:modelValue': [payload: MarketPlace];
  "done": [];
}>();

const props = defineProps<{ modelValue: MarketPlace, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const maxReferralFee = computed(() => {
  let maxFee = Math.round((modelValue.value.creatorFee ?? 3) / 3 * 10) / 10;
  if (maxFee > 1.5) {
    maxFee = 1.5;
  }

  if (modelValue.value.referralFee && modelValue.value.referralFee > maxFee) {
    modelValue.value.referralFee = maxFee;
  }

  return maxFee;

})

const FormSchema = z.object({
  creatorFee: z.number().min(0.5, {
    message: "Creator fee must be at least 0.5%"
  }).max(7.5, {
    message: "Creator fee must be at most 7.5%"
  }),
  referralFee: z.number().min(0.1, {
    message: "Referral fee must be at least 0.1%"
  }).max(toValue(maxReferralFee), {
    message: `Referral fee must be at most ${toValue(maxReferralFee)}%`
  }),
  curveRatio: z.number().min(1, {
    message: "Curve ratio must be at least 1"
  }).max(1000, {
    message: "Curve ratio must be at most 1000"
  }),
})

async function onContinue() {
  error.value = "";
  loading.value = true;

  if (!modelValue.value.curveRatio || !modelValue.value.creatorFee || !modelValue.value.referralFee) {
    loading.value = false;
    return;
  }

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
        marketplace: {
          ratio: data.data.curveRatio,
          creator_fee: data.data.creatorFee,
          referral_fee: data.data.referralFee,
        }
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
