export default defineAppConfig({
  app: {
    name: "Studio",
    network: "mainnet",
    githubRepo: "bitsongofficial/studio",
  },
  navigation: [
    {
      title: "Home",
      icon: "mdi-home",
      to: "/",
      onlyLoggedIn: false,
      exact: true,
    },
  ],
  socials: [
    {
      icon: ["fab", "discord"],
      href: "https://discord.bitsong.io",
    },
    {
      icon: ["fab", "twitter"],
      href: "https://twitter.com/BitSongOfficial",
    },
    {
      icon: ["fab", "telegram"],
      href: "https://t.me/BitSongOfficial",
    },
    {
      icon: ["fab", "instagram"],
      href: "https://www.instagram.com/bitsong_official",
    },
  ],
});
