export interface User {
  userId: string;
  address: string;
  username: string | null;
  avatar: string | null;
  cover: string | null;
}

export const useUserState = () => {
  const user = useState<User | null>("user", () => null);
  return user
}