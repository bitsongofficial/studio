import type { NavItem } from "~ui/types/navigation";

export function useNavigationDrawer() {
  const drawer = useState<boolean | null>("drawer", () => null);

  const open = () => {
    drawer.value = true;
  };

  const close = () => {
    drawer.value = false;
  };

  const toggle = () => {
    drawer.value = !drawer.value;
  };

  const navItems = useAppConfig().navigation as NavItem[];

  return {
    drawer,
    open,
    close,
    toggle,
    navItems,
  };
}
