<template>
  <v-dialog persistent width="585" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">

    <v-card :disabled="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title> Share </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pt-0">
        <v-row class="d-flex justify-space-between">
          <v-col class="text-center" cols="auto" v-for="provider in providers" :key="provider.id">
            <div @click.stop="onShare(provider.id)" :style="{ cursor: 'pointer' }">
              <NuxtImg height="50" width="50" :src="provider.icon" />
              <div class="text-body-2">{{ provider.name }}</div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-row no-gutters class="mb-1 align-center">
              <v-col cols="auto" v-if="!connected">
                <v-card-title>
                  Share and Earn
                </v-card-title>
                <v-card-subtitle>
                  Earn the referral fee by sharing this NFT
                </v-card-subtitle>
              </v-col>
              <v-col v-else cols="12" class="text-center">
                <v-card-title>
                  Share and Earn
                </v-card-title>
                <v-card-subtitle>
                  Your referral link was generated successfully
                </v-card-subtitle>
              </v-col>
              <v-col class="text-right" v-if="!connected">
                <AppConnectBtn />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field variant="outlined" :value="url" readonly>
              <template #append-inner>
                <v-btn size="small" variant="text" color="surface-variant" @click.stop="copy(url)">
                  Copy
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { useToast } from "vue-toastification";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const loading = ref(false);
const { connected } = useConnect();

const { success } = useToast();
const { copy, copied } = useClipboard();

watch(copied, (copied) => {
  if (copied) success("Copied to clipboard");
});

const url = computed(() => {
  const newUrl = window.location.href.split('?')[0];

  if (connected.value) {
    const address = getAddress('bitsong')
    if (address) {
      return `${newUrl}?ref=${address}`;
    }
  }

  return newUrl;
});

const providers = computed(() => [{
  id: 'telegram',
  name: 'Telegram',
  icon: '/images/social-shares/telegram.svg'
}, {
  id: 'whatsapp',
  name: 'WhatsApp',
  icon: '/images/social-shares/whatsapp.svg'
}, {
  id: 'x',
  name: 'X (twitter)',
  icon: '/images/social-shares/x.jpeg'
}, {
  id: 'reddit',
  name: 'Reddit',
  icon: '/images/social-shares/reddit.svg'
}, {
  id: 'linkedin',
  name: 'Linkedin',
  icon: '/images/social-shares/linkedin.svg'
}])

function onShare(provider: string) {
  let shareUrl
  let text = `Check out this Music #NFT on bitsong.studio ${url.value}`

  switch (provider) {
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      break;
    case 'x':
      text = text.replace('bitsong.studio', '@bitsongofficial')
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      break;
    case 'reddit':
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(text)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url.value)}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
      break;
  }

  window.open(shareUrl, '_blank');
}
</script>