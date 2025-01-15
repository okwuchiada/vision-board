import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/prisma_client";
import { getUserById } from "./lib/helper/db-helper";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        // session.user.id = token.sub;
      }
      if (session.user) {
        session.user.first_name = token.first_name as string;
        // session.user.last_name = token.last_name as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await getUserById(token.sub);

      if (!user) return token;

      token.first_name = user.first_name;
      token.last_name = user.last_name;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
