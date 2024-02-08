import {
  bitsong,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension, keplrMobile } from "@quirks/wallets";

export default defineNuxtPlugin((nuxtApp) => {
  const { walletconnectProjectId } = useRuntimeConfig().public;

  const config: Config = {
    wallets: [keplrExtension, leapExtension, keplrMobile],
    chains: [osmosis, bitsong],
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