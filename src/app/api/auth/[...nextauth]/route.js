import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials, req) {
        return await prisma.user.findUnique({
          where: { email: credentials.email },
        });
      },
    }),
  ],
});

export { handler as GET, handler as POST };
