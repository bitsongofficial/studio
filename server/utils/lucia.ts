import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { h3 } from "lucia/middleware";

const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client, {
    user: "user",
    session: "userSession",
    key: "userKey"
  }),
  middleware: h3(),
  env: process.dev ? "DEV" : "PROD",
  getUserAttributes: (data) => {
    return {
      address: data.address,
      avatar: data.avatar,
      cover: data.cover,
      username: data.username,
      email: data.email,
      email_verified: data.email_verified,
      email_verification_token: data.email_verification_token,
      email_verification_token_expires_at:
        data.email_verification_token_expires_at,
      email_verification_sent_at: data.email_verification_sent_at,
      email_verified_at: data.email_verified_at
    };
  }
});

export type Auth = typeof auth;