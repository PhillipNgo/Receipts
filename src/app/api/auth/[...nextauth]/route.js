import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        projectCode: { label: "Project code", type: "text" },
      },
      async authorize(credentials, req) {
        const projects = JSON.parse(process.env.PROJECTS);
        const participants = projects[credentials.projectCode];
        if (participants == null) {
          return null;
        }
        return participants.find(
          (participant) => participant.email === credentials.email
        );
      },
    }),
  ],
});

export { handler as GET, handler as POST };
