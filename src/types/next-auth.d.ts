import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      roles?: string[];
      taxpayerId?: string | null; // 👈 AJOUT ICI
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    roles?: string[];
    taxpayerId?: string | null; // 👈 AJOUT ICI
  }

  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    taxpayerId?: string | null; // 👈 AJOUT ICI
    roles?: string[];
  }
}
