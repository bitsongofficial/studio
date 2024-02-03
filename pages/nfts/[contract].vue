<template>
  <app-page>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8" class="text-center pb-0">
            <div>
              <!--<video v-if="data?.animation_url" class="mx-auto rounded-xl media__content" controls :poster="nftImage">
                <source :src="useIpfsLink(data?.animation_url)" type="audio/mp3" />
              </video>-->
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
              <v-col class="text-center">
                <div class="text-grey text-body-2">Buy Price</div>
                <v-skeleton-loader v-if="loadings.buy" class="mx-auto" type="text"></v-skeleton-loader>
                <div v-else>{{ formatCoinAmount(useFromMicroAmount(prices.buy)) }}<br /><span
                    class="text-subtitle-2">BTSG</span>
                </div>
              </v-col>

              <v-col class="text-center">
                <div class="text-grey text-body-2">Last Price</div>
                <v-skeleton-loader v-if="loadings.last" class="mx-auto" type="text"></v-skeleton-loader>
                <div class="text-grey" v-else-if="!loadings.last && prices.last > 0">
                  {{ formatCoinAmount(useFromMicroAmount(prices.last)) }}<br /><span class="text-subtitle-2">BTSG</span>
                </div>
              </v-col>

              <v-col class="text-center">
                <div class="text-grey text-body-2">Sell Price</div>
                <v-skeleton-loader v-if="loadings.sell" class="mx-auto" type="text"></v-skeleton-loader>
                <div v-else-if="!loadings.sell && prices.sell > 0">{{ formatCoinAmount(useFromMicroAmount(prices.sell))
                }}<br /><span class="text-subtitle-2">BTSG</span>
                </div>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" class="d-flex align-center pb-4 justify-space-between">

                    <AppNftMarketplace v-if="data?.marketplace_address && (prices.buy > 0 || prices.sell > 0)"
                      @openDialog="openMarketplaceDialog" />

                  </v-col>
                </v-row>
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
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
  <AppNftCurveDialog v-if="data?.marketplace_address" v-model="marketplaceDialog"
    :marketplaceAddress="data?.marketplace_address" :nftAddress="contractAddress" :side="marketplaceSide"
    :image="data?.image" :title="data?.name" :creator="data?.sender" :buy_price="prices.buy" :sell_price="prices.sell" />
</template>

<script lang="ts" setup>
import { marked } from 'marked'
import { contracts } from "@bitsongjs/telescope";
import defaultImage from "@/assets/images/default.png";
import { useTimeAgo } from '@vueuse/core'
import { formatNumber, formatCoinAmount } from '~/utils';

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

const { Bs721CurveQueryClient } = contracts.Bs721Curve;

async function fetchPrices(amount: number = 1) {
  await execute();
  await executeActivities();

  const marketplace = data.value?.marketplace_address;
  if (!marketplace) {
    return;
  }

  const bs721QueryClient = new Bs721CurveQueryClient(
    await useQueryClient("bitsong"),
    marketplace,
  );

  const [buy_price, sell_price] = await Promise.all([
    bs721QueryClient.buyPrice({
      // @ts-ignore
      amount: amount.toString(),
    }),
    bs721QueryClient.sellPrice({
      // @ts-ignore
      amount: amount.toString(),
    }),
  ]);

  prices.buy = parseInt(buy_price.total_price);
  prices.sell = parseInt(sell_price.total_price);

  loadings.buy = false;
  loadings.sell = false;
}

let interval: string | number | NodeJS.Timeout | undefined;

onMounted(async () => {
  await fetchPrices();

  interval = setInterval(async () => {
    await fetchPrices();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
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