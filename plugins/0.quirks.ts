import {
  chain as _bitsong,
  assets as bitsongAssetList,
} from 'chain-registry/mainnet/bitsong'
import {
  chain as osmosis,
  assets as osmosisAssetList,
} from 'chain-registry/mainnet/osmosis'
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension, keplrMobile, leapMobile } from "@quirks/wallets";
import { generateConfig, initialStateWithCookie } from '@quirks/ssr'
import { defineNuxtPlugin, useCookie } from '#imports'

export default defineNuxtPlugin({
  name: 'quirks:plugin',
  order: 0,
  parallel: false,
  async setup(nuxtApp) {
    const bitsong = {
      ..._bitsong,
      apis: {
        rpc: [
          {
            address: "https://rpc.explorebitsong.com",
            provider: "bitsong-team"
          }
        ],
        rest: [
          {
            address: "https://lcd.explorebitsong.com",
            provider: "bitsong-team"
          },
        ]
      },
    }

    const { walletconnectProjectId } = useRuntimeConfig().public;

    const config: Config = generateConfig({
      wallets: [keplrExtension, leapExtension, keplrMobile, leapMobile],
      chains: [osmosis, bitsong],
      assetsLists: [osmosisAssetList, bitsongAssetList],
      autoAccountChange: false,
      walletConnectOptions: {
        providerOpts: {
          logger: "info",
          projectId: walletconnectProjectId as string,
          metadata: {
            name: "BitSong Studio",
            description: "BitSong Studio x WalletConnect",
            url: "https://bitsong.studio",
            icons: ["https://bitsong.studio/images/logo-circle.png"],
          }
        }
      }
    });

    const cookie = useCookie('quirks')
    const configWithCookie = initialStateWithCookie(config, JSON.stringify(cookie.value))

    nuxtApp.vueApp.use(quirksPlugin, configWithCookie)
  }
});