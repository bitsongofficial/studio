export default defineAppConfig({
  app: {
    name: 'Studio',
    network: 'mainnet',
    githubRepo: 'bitsongofficial/studio',
  },
  socials: [
    {
      icon: ['fab', 'discord'],
      href: 'https://discord.bitsong.io',
    },
    {
      icon: ['fab', 'twitter'],
      href: 'https://twitter.com/BitSongOfficial',
    },
    {
      icon: ['fab', 'telegram'],
      href: 'https://t.me/BitSongOfficial',
    },
    {
      icon: ['fab', 'instagram'],
      href: 'https://www.instagram.com/bitsong_official'
    },
  ]
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    app?: {
      name?: string,
      network?: string,
      githubRepo?: string,
    },
    socials?: {
      icon: [string, string],
      href: string,
    }[]
  }
}
