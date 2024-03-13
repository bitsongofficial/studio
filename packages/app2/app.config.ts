// @unocss-include <== DON'T REMOVE THIS LINE

export default defineAppConfig({
  app: {
    name: "Studio",
    network: "mainnet",
    githubRepo: "bitsongofficial/studio",
  },
  navigation: [
    {
      title: "Home",
      icon: "i-mdi:home",
      to: "/",
      onlyLoggedIn: false,
      exact: true,
    },
  ],
  socials: [
    {
      icon: "i-mdi:discord",
      href: "https://discord.bitsong.io",
    },
    {
      icon: "i-line-md:twitter-x",
      href: "https://twitter.com/BitSongOfficial",
    },
    {
      icon: "i-mdi:telegram",
      href: "https://t.me/BitSongOfficial",
    },
    {
      icon: "i-mdi:instagram",
      href: "https://www.instagram.com/bitsong_official",
    },
  ],
});
