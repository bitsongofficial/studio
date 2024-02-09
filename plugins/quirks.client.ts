import {
  bitsong,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension } from "@quirks/wallets";

const newbitsong = {
  ...bitsong,
  apis: {
    rpc: [
      {
        address: "https://rpc.explorebitsong.com",
        provider: "bitsong"
      }
    ],
    rest: [
      {
        address: "https://lcd.explorebitsong.com",
        provider: "bitsong"
      },
    ]
  },
}

const config: Config = {
  wallets: [keplrExtension, leapExtension],
  chains: [osmosis, newbitsong],
  assetsLists: [osmosisAssetList, bitsongAssetList],
  autoAccountChange: false
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(quirksPlugin, config);
});