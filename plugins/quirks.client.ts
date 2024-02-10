import {
  bitsong,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension, keplrMobile, leapMobile } from "@quirks/wallets";

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

export default defineNuxtPlugin((nuxtApp) => {
  const { walletconnectProjectId } = useRuntimeConfig().public;

  const config: Config = {
    wallets: [keplrExtension, leapExtension, keplrMobile, leapMobile],
    chains: [osmosis, newbitsong],
    assetsLists: [osmosisAssetList, bitsongAssetList],
    autoAccountChange: false,
    walletConnectOptions: {
      providerOpts: {
        projectId: walletconnectProjectId,
        metadata: {
          name: "BitSong Studio",
          description: "BitSong Studio x WalletConnect",
          url: "https://bitsong.studio",
          icons: ["https://bitsong.studio/images/logo-circle.png"],
        }
      }
    }
  };

  nuxtApp.vueApp.use(quirksPlugin, config);
});