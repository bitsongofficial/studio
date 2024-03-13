export interface NavItem {
  title: string;
  icon: string;
  to: string;
  onlyLoggedIn?: boolean;
  exact?: boolean;
}
