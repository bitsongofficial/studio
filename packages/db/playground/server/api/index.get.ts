export default defineEventHandler(async (event) => {
  const { database } = event.context
  return await database.user.findFirst()
})