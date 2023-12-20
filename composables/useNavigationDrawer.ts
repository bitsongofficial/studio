interface NavItem {
  title: string;
  icon: string;
  to: string;
  onlyLoggedIn?: boolean;
  exact?: boolean;
}

export const useNavigationDrawer = () => {
  const drawer = useState<boolean>("drawer", () => true);

  const open = () => {
    drawer.value = true
  }

  const close = () => {
    drawer.value = false
  }

  const toggle = () => {
    drawer.value = !drawer.value
  }

  const navItems = computed<NavItem[]>(() => {
    return [
      {
        title: "Home",
        icon: "mdi-home",
        to: "/",
        onlyLoggedIn: false,
        exact: true,
      }, {
        title: "Create Podcast",
        icon: "mdi-podcast",
        to: "/create/podcast",
        onlyLoggedIn: true,
        exact: true,
      }, {
        title: "Episodes",
        icon: "mdi-podcast",
        to: "/me/podcast/episodes",
        onlyLoggedIn: true,
        exact: true,
      }
    ];
  });

  return {
    drawer,
    open,
    close,
    toggle,
    navItems
  }
}