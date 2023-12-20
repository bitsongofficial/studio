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
      username: data.username,
      avatar: data.avatar,
      cover: data.cover
    };
  }
});

export type Auth = typeof auth;