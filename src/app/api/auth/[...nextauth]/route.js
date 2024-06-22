import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  callbacks: {
    async session({ session, token }) {
      session.projectCode = token.sub;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        projectCode: { label: "Project code", type: "text" },
      },
      async authorize(credentials, req) {
        const response = await sql`
            WITH valid_users as (
              SELECT UNNEST(users) as email
              FROM projects
              WHERE key=${credentials.projectCode} AND ${credentials.email}=ANY(users)
              LIMIT 1
            )
            SELECT *
            FROM valid_users
            JOIN users
              ON valid_users.email=users.email
            WHERE users.email=${credentials.email}
            LIMIT 1
        `;
        const user = response.rows[0];
        if (user != null) {
          user.id = credentials.projectCode;
        }
        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
