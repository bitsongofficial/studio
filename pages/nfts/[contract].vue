<template>
  <app-page>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8" class="text-center pb-0">
            <div>
              <video v-if="data?.animation_url" class="mx-auto rounded-xl media__content" controls playsinline
                :poster="nftImage" :src="useIpfsLink(data?.animation_url)"></video>
              <v-img v-else class="mx-auto rounded-xl w-75" :src="nftImage">
              </v-img>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <h1 class="text-md-h4 text-h5">
                  {{ data?.name }}
                </h1>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="px-0">
                <ClientOnly>
                  <AppNftMarketplace v-if="data?.marketplace_address" @openDialog="openMarketplaceDialog"
                    :marketplace-address="data?.marketplace_address" :nft-address="data.id" :title="data?.name"
                    :image="data?.image!" :last-price="prices.last" />
                </ClientOnly>
              </v-col>
            </v-row>


            <v-row>


              <v-col cols="6">
                <div class="text-caption text-grey text-uppercase">NFT</div>
                <div>
                  <nuxt-link :to="`/nfts/${contractAddress}`" class="text-decoration-none text-white">
                    {{ formatShortAddress(contractAddress, 8) }}
                  </nuxt-link>
                </div>
              </v-col>

              <v-col cols="6" v-if="data?.sender">
                <div class="text-caption text-grey text-uppercase">CREATOR</div>
                <div>
                  <nuxt-link :to="`/u/${data?.sender}`" class="text-decoration-none text-white">
                    {{ formatShortAddress(data?.sender, 8) }}
                  </nuxt-link>
                </div>
              </v-col>

              <v-col cols="6" v-if="false">
                <div class="text-caption text-grey text-uppercase">
                  Max Edition
                </div>
                <div>-</div>
              </v-col>

              <v-col cols="6" v-if="data?.payment_address">
                <div class="text-caption text-grey text-uppercase">
                  Royalties Address
                </div>
                <div>
                  <NuxtLink :to="`https://mintscan.io/bitsong/address/${data?.payment_address}`" target="_blank"
                    class="text-decoration-none text-white">
                    {{ formatShortAddress(data?.payment_address, 8) }}
                  </NuxtLink>
                </div>
              </v-col>

              <v-col cols="6" v-if="data?.payment_address">
                <div class="text-caption text-grey text-uppercase">
                  Marketplace Address
                </div>
                <div>
                  <NuxtLink :to="`https://mintscan.io/bitsong/address/${data?.marketplace_address}`" target="_blank"
                    class="text-decoration-none text-white">
                    {{ formatShortAddress(data?.marketplace_address!, 8) }}
                  </NuxtLink>
                </div>
              </v-col>

              <v-col cols="6" v-if="data?.seller_fee_bps">
                <div class="text-caption text-grey text-uppercase">
                  Seller Fee %
                </div>
                <div>
                  {{ useFromBasisPoints(data?.seller_fee_bps).toFixed(2) }}
                  %</div>
              </v-col>

              <v-col cols="6" v-if="data?.referral_fee_bps && data?.seller_fee_bps">
                <div class="text-caption text-grey text-uppercase">
                  Referral Fee %
                </div>
                <div>
                  {{ (((Number(data?.seller_fee_bps) / 10000) * (Number(data?.referral_fee_bps) / 10000)) *
                    100).toFixed(2) }} %
                </div>
              </v-col>

              <v-col cols="6" v-if="data?.max_per_address">
                <div class="text-caption text-grey text-uppercase">
                  Max per Address
                </div>
                <div>{{ data?.max_per_address }}</div>
              </v-col>

              <v-col cols="6" v-if="data?.volume">
                <div class="text-caption text-grey text-uppercase">
                  Total Volume
                </div>
                <div>{{ formatNumber(useFromMicroAmount(data?.volume)) }} <span class="text-subtitle-2">BTSG</span></div>
              </v-col>

              <v-col cols="6" v-if="data?.owners">
                <div class="text-caption text-grey text-uppercase">
                  Unique Owners
                </div>
                <div>{{ data.owners }}</div>
              </v-col>

              <v-col cols="6" v-if="data?.editions">
                <div class="text-caption text-grey text-uppercase">
                  Editions
                </div>
                <div>{{ data.editions }}</div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" cols="12" class="mt-4">
            <v-tabs v-model="selectedTab">
              <v-tab :value="1">Description</v-tab>
              <v-tab :value="2">Activity</v-tab>
              <v-tab :value="3">Royalties</v-tab>
            </v-tabs>


            <div v-if="selectedTab === 1" class="md__content mt-4"
              v-html="marked.parse(data?.metadata.description || '')">
            </div>


            <div v-if="selectedTab === 2" class="mt-4">
              <div v-if="activities && activities?.length > 0" class="d-flex align-center py-2"
                v-for="activity in activities" :key="activity.id">
                <div class="mr-2">
                  <nuxt-link :to="`/u/${activity.sender}`" class="text-decoration-none text-white">
                    <v-avatar size="32">
                      <v-img height="32" width="32" :src="defaultImage"> </v-img>
                    </v-avatar>
                  </nuxt-link>
                </div>
                <div class="me-auto text-grey">
                  <nuxt-link :to="`/u/${activity.sender}`" class="text-decoration-none text-white">
                    {{ formatShortAddress(activity.sender, 8) }}
                  </nuxt-link>

                  <span :class="{
                    'text-green': activity.side === 'buy',
                    'text-red': activity.side === 'sell',
                  }">
                    &nbsp;{{ activity.side === "buy" ? "minted" : "burned" }}&nbsp;
                  </span>

                  <span class="text-white">#{{
                    activity.token_id
                  }}</span>
                  for
                  <span :class="{
                        'text-green': activity.side === 'buy',
                        'text-red': activity.side === 'sell',
                      }">
                    {{ formatCoinAmount(useFromMicroAmount(activity.total_price)) }}
                    <span class="text-subtitle-2">BTSG</span>
                  </span>
                  <span v-if="activity.referral">
                    referred by
                    <span class="text-white">{{ activity.referral }}</span>
                  </span>
                </div>
                <div class="text-grey text-right">
                  {{ useTimeAgo(activity.timestamp).value }}
                </div>
              </div>
            </div>

            <div v-if="selectedTab === 3">
              <v-container fluid v-if="errorRoyalties">
                <v-row>
                  <v-col>
                    Error while loading royalties
                  </v-col>
                </v-row>
              </v-container>
              <v-container fluid v-else>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="text-body-1 text-surface-variant">Royalties Contract</div>
                    <div class="text-h6">{{ formatShortAddress(data?.payment_address || '', 8) }}</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="text-body-1 text-surface-variant">Total Royalties</div>
                    <div class="text-h6">{{ formatCoinAmount(useFromMicroAmount(royalties?.totalRoyalties || 0)) }} BTSG
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-card>
                      <v-table>
                        <thead>
                          <tr>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Shares</th>
                            <th>Available</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="contributor in royalties?.contributors">
                            <td class="w-25">{{ formatShortAddress(contributor.address, 8) }}</td>
                            <td class="w-25">{{ contributor.role }}</td>
                            <td class="w-25">{{ contributor.initial_shares }} <span class="text-surface-variant">
                                ({{ (parseFloat(contributor.percentage_shares) * 100).toFixed(2) }} %)
                              </span></td>
                            <td class="w-25">
                              {{ formatCoinAmount(useFromMicroAmount(contributor.available_amount)) }} BTSG
                            </td>
                            <td>
                              <ClientOnly>
                                <v-btn :loading="withdrawLoading"
                                  v-if="getAddress('bitsong') === contributor.address && contributor.available_amount > 0"
                                  size="small" @click.stop="onWithdraw">Withdraw</v-btn>
                              </ClientOnly>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { marked } from 'marked'
import defaultImage from "@/assets/images/default.png";
import { useTimeAgo } from '@vueuse/core'
import { formatNumber, formatCoinAmount } from '~/utils';
import { cosmwasm } from '@bitsongjs/telescope'
import { toUtf8 } from '@cosmjs/encoding'

const img = useImage();

const contractAddress = useRoute().params.contract as string
const selectedTab = ref(1)

const prices = reactive({
  buy: 0,
  sell: 0,
  last: 0,
})

const loadings = reactive({
  buy: true,
  sell: true,
  last: true,
})

const { data, error, execute } = await useFetch(`/api/nfts/${contractAddress}`, {
  onResponse(context) {
    prices.last = context.response._data?.last_price || 0;
    loadings.last = false;
  },
})

useSeoMeta({
  title: data.value?.name,
  //titleTemplate: '%s | BitSong Studio',
  description: data.value?.metadata.description || '',
  ogTitle: data.value?.name,
  twitterTitle: data.value?.name,
  ogImage: data.value?.image ? useIpfsLink(data.value?.image) : '',
  ogDescription: data.value?.metadata.description || '',
  twitterDescription: data.value?.metadata.description || '',
  twitterCard: "summary_large_image",
})

defineOgImageComponent('Nft', {
  title: data.value?.name,
  subtitle: `by ${formatShortAddress(data.value?.sender!, 12)}`,
  price: prices.last,
  volume: data.value?.volume,
  image: data.value?.image ? useIpfsLink(data.value?.image) : '',
  editions: data.value?.editions,
  owners: data.value?.owners,
});

const nftImage = computed(() => {
  if (!data.value?.image) {
    return defaultImage;
  }

  return img(useIpfsLink(data.value?.image)!, { width: 1280, format: 'webp' });
});

const { data: activities, execute: executeActivities } = useFetch(`/api/nfts/${contractAddress}/activities`)

const marketplaceDialog = ref(false);
const marketplaceSide = ref<"buy" | "sell">("buy");

if (error.value) {
  navigateTo('/')
}

function openMarketplaceDialog(side: "buy" | "sell") {
  marketplaceSide.value = side;
  marketplaceDialog.value = true;
}

const { data: royalties, error: errorRoyalties, refresh: refreshRoyalties } = await useFetch(`/api/nfts/${contractAddress}/royalties`);

const { success, error: errorNotify } = useNotify()
const withdrawLoading = ref(false)

async function onWithdraw() {
  withdrawLoading.value = true;

  try {
    const address = getAddress("bitsong");

    const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl

    const msgs = [
      executeContract({
        sender: address,
        contract: data.value?.payment_address!, // TODO: fix this, it should be the contract address
        msg: toUtf8(JSON.stringify({ distribute: {} })),
        funds: [],
      }),
      executeContract({
        sender: address,
        contract: data.value?.payment_address!, // TODO: fix this, it should be the contract address
        msg: toUtf8(JSON.stringify({ withdraw: {} })),
        funds: [],
      }),
    ]

    const txRaw = await signCW("bitsong", msgs);
    const broadcast = (await import("@quirks/store")).broadcast;
    await broadcast("bitsong", txRaw);

    success("Withdrawn successfully")

    await refreshRoyalties();

    const { fetchBalance } = useUserBalance();
    await fetchBalance(address)

    umTrackEvent('withdraw-royalties', { nftAddress: contractAddress })
  } catch (e) {
    // TODO: fix cosmos errors, check if the address doesn't have enough funds or exists on chain
    console.error(e)
    errorNotify("Error while withdrawing")
    umTrackEvent('withdraw-royalties-error', { nftAddress: contractAddress })
  } finally {
    withdrawLoading.value = false;
  }
}

let interval: string | number | NodeJS.Timeout | undefined;
let intervalActivities: string | number | NodeJS.Timeout | undefined;

onMounted(async () => {
  await execute();
  await executeActivities();

  interval = setInterval(async () => {
    await execute();
  }, 2000);

  intervalActivities = setInterval(async () => {
    await executeActivities();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
  clearInterval(intervalActivities);
});
</script>

<style>
.md__content p {
  padding-top: 10px;
  padding-bottom: 10px;
}

.media__content {
  width: 100%;
}

@media (min-width: 768px) {
  .media__content {
    width: 75%;
  }
}
</style>