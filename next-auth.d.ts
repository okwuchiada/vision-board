import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  first_name: string;
  last_name: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
