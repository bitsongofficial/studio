import { H3Event } from 'h3'

export async function ensureAuth(event: H3Event) {
    const authRequest = auth.handleRequest(event);
    const session = await authRequest.validate();
    const user = session?.user ?? null

    if (user === null) {
        throw createError({
            message: 'You must be logged in to create your podcast',
            status: 401
        })
    }

    return user
}