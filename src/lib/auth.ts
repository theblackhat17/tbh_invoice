// src/lib/auth.ts
import lucia from "lucia";
import sveltekit from "lucia-auth/middleware/sveltekit";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "$lib/prisma";

export const auth = lucia({
  adapter: PrismaAdapter(prisma),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: sveltekit(),
  transformUserData: (userData) => ({
    id: userData.id,
    email: userData.email,
    avatar: userData.avatar,
    billing: userData.billing
  })
});
