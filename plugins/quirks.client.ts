import {
  bitsong as bitsongConfig,
  bitsongAssetList,
  osmosis,
  osmosisAssetList,
} from "@nabla-studio/chain-registry";
import { WCWallet } from "@quirks/core";
import type { Config } from "@quirks/store";
import { keplrExtension, leapExtension, keplrMobile, leapMobile } from "@quirks/wallets";

const bitsong = {
  ...bitsongConfig,
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

const telegram = new WCWallet({
  $schema: '../../wallet.schema.json',
  wallet_name: 'telegram',
  pretty_name: 'Telegram Wallet',
  connection_type: 'wallet_connect',
  supported_chains: [
    'cosmoshub',
    'osmosis',
    'secretnetwork',
    'regen',
    'akash',
    'sifchain',
    'stargaze',
    'sentinel',
    'persistence',
    'cryptoorgchain',
    'irisnet',
    'agoric',
    'axelar',
    'certik',
    'ixo',
    'emoney',
    'tick',
    'terra',
    'likecoin',
    'bitcanna',
    'bitsong',
    'ki',
    'panacea',
    'juno',
    'sommelier',
    'umee',
    'evmos',
    'injective',
    'bostrom',
    'comdex',
    'cheqd',
    'chihuahua',
    'lumnetwork',
    'vidulum',
    'desmos',
    'dig',
    'starname',
    'gravitybridge',
  ],
  //features: ['icns'],
  platforms: [
    {
      device: 'mobile',
      type: 'application',
      platform: 'ios',
      install_link: 'https://apps.apple.com/app/telegram-messenger/id686449807',
    },
    {
      device: 'mobile',
      type: 'application',
      platform: 'android',
      install_link: 'https://play.google.com/store/apps/details?id=org.telegram.messenger',
    },
  ],
  images: [
    {
      png: 'https://pub-e785138d3f324a1390631e14d34b68ec.r2.dev/telegram-logo.png',
      layout: 'logomark',
    }
  ],
  wallet_connect: {
    deeplink: {
      path: {
        android: 'wcV2',
        ios: 'wcV2',
      },
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  const { walletconnectProjectId } = useRuntimeConfig().public;

  const config: Config = {
    wallets: [telegram, keplrExtension, leapExtension, keplrMobile, leapMobile],
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
  };

  nuxtApp.vueApp.use(quirksPlugin, config);
});