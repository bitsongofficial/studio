export default defineNuxtRouteMiddleware(async () => {
  const user = useUserState();
  if (!user.value) return navigateTo("/");

  watchEffect(() => {
    if (!user.value) return navigateTo("/");
  })
});