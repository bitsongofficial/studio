<template>
  <div v-bind="$attrs">
    <v-container fluid class="pb-0">
      <v-row :align="`center`">
        <v-col cols="8">
          <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
            {{ title }}
            <v-chip v-if="chipText" size="small" class="ml-4">{{ chipText }}</v-chip>
          </div>
        </v-col>
        <v-col cols="4" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn @click.stop="swiperRef.$el.swiper.slidePrev()" icon="mdi-chevron-left" variant="text"></v-btn>

          <v-btn variant="text" @click.stop="swiperRef.$el.swiper.slideNext()" icon="mdi-chevron-right">
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <swiper :slidesPerView="'auto'" :freeMode="true" :modules="modules" :navigation="true" ref="swiperRef">
      <swiper-slide v-for="item in items" :key="Math.random().toString(6)" style="width: 220px">
        <v-container class="mr-2" :class="{
          'text-center': item.variant === 'profile',
        }">
          <v-row :align="item.variant === 'profile' ? 'center' : 'start'"
            :justify="item.variant === 'profile' ? 'center' : 'start'">
            <v-col cols="12">
              <nuxt-link :to="item.titleLink" class="text-decoration-none text-grey">
                <v-avatar size="160" v-if="item.variant === 'profile'">
                  <NuxtImg :src="item.image || defaultImage" :alt="item.title" width="160" height="160" format="webp"
                    fit="cover" />
                </v-avatar>
                <NuxtImg v-else :src="item.image || defaultImage" :alt="item.title" width="180" height="180" format="webp"
                  fit="cover" />
              </nuxt-link>
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col v-if="item.variant === 'profile'" class="mx-auto text-subtitle-1 font-weight-thin">
              <nuxt-link :to="item.titleLink" class="text-decoration-none text-white">
                {{ item.title }}
              </nuxt-link>
            </v-col>
            <v-col v-else cols="12" class="text-subtitle-1 font-weight-thin">
              <nuxt-link :to="item.titleLink" class="text-decoration-none text-white">
                <v-card-title class="pa-0 text-subtitle-1" style="max-width: 180px">
                  {{ item.title }}
                </v-card-title>
              </nuxt-link>

              <v-card-subtitle class="pa-0" v-if="item.variant === 'nft'">
                by
                <nuxt-link :to="item.subtitleLink" class="text-decoration-none text-grey text-subtitle-2">
                  {{ formatShortAddress(item.subtitle, 8) }}
                </nuxt-link>
              </v-card-subtitle>

              <v-card-subtitle class="pa-0" v-else-if="item.variant === 'music_nft'">
                by
                <nuxt-link :to="item.subtitleLink" class="text-decoration-none text-grey text-subtitle-2">
                  {{ item.subtitle }}
                </nuxt-link>
              </v-card-subtitle>

              <v-card-subtitle style="max-width: 210px" class="pa-0" v-if="item.variant === 'nft_token'">
                <nuxt-link :to="item.subtitleLink" class="text-decoration-none text-grey text-subtitle-2">
                  {{ item.title }}
                </nuxt-link>
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-container>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Pagination } from "swiper/modules";
import defaultImage from "@/assets/images/default.png";
// import { usePlayerStore } from "@/store/player";

// const player = usePlayerStore();

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const modules = ref([FreeMode, Pagination]);
const swiperRef = ref();

export interface SwiperItem {
  id?: string;
  variant: "nft_token" | "nft" | "profile" | "music_nft";
  image?: string;
  title: string;
  titleLink: string;
  subtitle?: string;
  subtitleLink?: string;
}

export interface SwiperProps {
  title: string;
  chipText?: string;
  items?: SwiperItem[] | null;
}

defineProps<SwiperProps>();
</script>
