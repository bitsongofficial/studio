import type { NavItem, SocialItem } from "~ui/types"

export default defineAppConfig({
  app: {
    name: 'Studio',
    network: 'mainnet',
    githubRepo: 'bitsongofficial/studio',
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    app?: {
      name?: string,
      network?: string,
      githubRepo?: string,
    },
    navigation?: NavItem[],
    socials?: SocialItem[],
  }
}
