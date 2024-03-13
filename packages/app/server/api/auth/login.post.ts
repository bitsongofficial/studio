import { auth } from "../../utils/lucia";
import { LuciaError, Session } from "lucia";
import { verifySignature } from "../../utils/bitsong";

export default defineEventHandler(async (event): Promise<Session> => {
  const { msg } = await readBody<{ msg: string; }>(event);

  if (typeof msg !== "string" || msg.length === 0) {
    throw createError({
      message: "Invalid message",
      statusCode: 400
    });
  }

  const address = await verifySignature(msg)

  const createSession = async (userId: string) => {
    const session = await auth.createSession({
      userId,
      attributes: {}
    })

    const authRequest = auth.handleRequest(event)
    authRequest.setSession(session)

    return session
  }

  try {
    const key = await auth.useKey("bitsong", address, null);
    return await createSession(key.userId)
  } catch (e) {
    if (e instanceof LuciaError && e.message === "AUTH_INVALID_KEY_ID") {
      const user = await auth.createUser({
        key: {
          providerId: "bitsong",
          providerUserId: address,
          password: null
        },
        attributes: {
          address,
          username: null,
          avatar: null,
          cover: null,
          email: null,
          email_verified: false,
          email_verification_token: null,
          email_verification_sent_at: null,
          email_verification_token_expires_at: null,
          email_verified_at: null
        }
      })

      return await createSession(user.userId)
    }

    // if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
    //   throw createError({
    //     message: "Address is already registered",
    //     statusCode: 400
    //   });
    // }

    console.log("Unknown error: /api/auth/login.post.ts")
    console.error(e)

    throw createError({
      message: "An unknown error occurred",
      statusCode: 500
    });
  }
})